<template>
  <Container class="email-form">
    <h2 class="email-form__heading">{{ content?.heading }}</h2>
    <p class="email-form__copy" v-for="(para, index) in content?.paragraphs" :key="index">{{ para }}</p>
    <p class="email-form__disclaimer">*Indicates required field</p>
    <form name="email-form">
      <label for="name">
        Name:
        <input
          type="text"
          name="name"
          id="name"
          v-model="form.name.value"
          pattern="[a-zA-Z]"
          placeholder="First name"
          autocomplete="off"
        />
      </label>
      <label class="vh" for="lastname">
        <input name="lastname" id="lastname" placeholder="Last name" tabindex="-1" autocomplete="off" ref="honeypot" />
      </label>
      <label for="email">
        Email address*:
        <input
          :class="{ invalid: form.email.errors }"
          type="email"
          name="email"
          id="email"
          autocomplete="off"
          v-model="form.email.value"
          @blur="validateInput"
          @input="validateInput"
          placeholder="you@example.com"
          required
          data-bwignore
          data-lpignore="true"
          data-1p-ignore
        />
      </label>
      <p class="email-form__error-message" v-if="form.email.errors">{{ displayErrors(form.email.errors) }}</p>
      <label for="subject">
        Subject*:
        <input
          :class="{ invalid: form.subject.errors }"
          type="text"
          name="subject"
          id="subject"
          autocomplete="off"
          v-model="form.subject.value"
          @blur="validateInput"
          @input="validateInput"
          placeholder="Subject line"
          required
        />
      </label>
      <p class="email-form__error-message" v-if="form.subject.errors">{{ displayErrors(form.subject.errors) }}</p>
      <label for="message">
        Message*:
        <textarea
          :class="{ invalid: form.message.errors }"
          name="message"
          id="message"
          autocomplete="off"
          v-model="form.message.value"
          spellcheck="true"
          wrap="soft"
          @input="validateInput"
          @blur="validateInput"
          placeholder="Message"
          required
        />
      </label>
      <p class="email-form__error-message" v-if="form.message.errors">{{ displayErrors(form.message.errors) }}</p>
      <button class="email-form__button button" type="button" role="button" @click.prevent="sendMail" :disabled="!isFormValid">
        {{ isFormValid ? 'Send Email' : 'Please fill in the required fields' }}
      </button>
    </form>
    <div v-if="emailResponse !== null || sendPending" class="res-message">
      <transition-group tag="div" class="res-message__container" name="scale" appear>
        <div v-if="sendPending" key="email-sending" class="res-message__content">
          <IconEmailSending class="res-message__icon" />
          <h3 class="res-message__heading">Sending email</h3>
        </div>
        <div v-else-if="emailResponse !== null" key="email-response" class="res-message__content">
          <component :is="emailResponse.success ? IconEmailSent : IconEmailFailed" class="res-message__icon" />
          <h3 class="res-message__heading">
            {{ emailResponse.success === false ? 'Email failed to send' : 'Email received!' }}
          </h3>
          <p class="res-message__copy">
            {{ emailResponse.success === false ? `${emailResponse.message || emailResponse.error}` : 'Talk to you soon!' }}
          </p>
        </div>
      </transition-group>
    </div>
  </Container>
</template>

<script setup lang="ts">
  import type { IDetailsFields } from '@/types/contentful';
  import { computed, onMounted, useTemplateRef, reactive, ref } from 'vue';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useContentStore } from '@/stores/content.ts';
  import { useRest } from '@/composables/useRest.ts';
  import Container from '@/components/Container.vue';
  import IconEmailSent from '@/components/icons/IconEmailSentFilled.vue';
  import IconEmailFailed from '@/components/icons/IconEmailFailedFilled.vue';
  import IconEmailSending from '@/components/icons/IconEmailSending.vue';

  interface FormFields {
    required: boolean;
    value: string;
    isValid?: boolean;
    errors?: string[];
  }
  interface EmailForm {
    name: FormFields;
    email: FormFields;
    subject: FormFields;
    message: FormFields;
  }
  type EmailRequestBody = Record<keyof EmailForm, string>;

  const { closeCb } = defineProps<{
    closeCb: () => void;
  }>();

  const { baseFetch } = useRest();
  const { getContentfulEntry } = useContentStore();
  const { isUserOptedOut } = useGlobalStore();
  const matomo = useMatomo();

  const honeypotRef = useTemplateRef<HTMLInputElement>('honeypot');
  const content = ref<IDetailsFields>();
  const form = reactive<EmailForm>({
    name: {
      required: false,
      value: '',
    },
    email: {
      required: true,
      value: '',
      errors: undefined,
      isValid: undefined,
    },
    subject: {
      required: true,
      value: '',
      errors: undefined,
      isValid: undefined,
    },
    message: {
      required: true,
      value: '',
      errors: undefined,
      isValid: false,
    },
  });
  const formValidation: { [K in keyof Omit<EmailForm, 'name'>]: Record<string, RegExp> } = {
    email: {
      'Email address is invalid.': /.+@.+\..+/,
      'An email address is required.': /.+/,
    },
    subject: {
      'A subject is required.': /.+/,
    },
    message: {
      'A message is required.': /.+/,
    },
  };
  const emailResponse = ref<null | { success: boolean; message?: string; error?: string }>(null);
  const sendPending = ref(false);

  const isFormValid = computed(() => {
    const result: boolean[] = [];
    (Object.keys(form) as Array<keyof EmailForm>).forEach((key) => {
      if (form[key].required) result.push(form[key as keyof EmailForm].isValid || false);
    });
    return !result.includes(false);
  });

  const validateInput = ({ target, type }: Event) => {
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      const name = target.name as keyof Omit<EmailForm, 'name'>;
      const formEntry = form[name];
      // Prevent error message from showing when they first use an input
      if (type === 'input' && formEntry?.isValid === undefined) return;
      validateField(name);
    }
  };
  const validateField = (name: keyof Omit<EmailForm, 'name'>) => {
    const errors: string[] = [];
    const formEntry = form[name];
    const validationRules = formValidation[name];

    formEntry.isValid = false;
    if (formEntry.errors) formEntry.errors = undefined;
    Object.entries(validationRules).forEach(([msg, regex]) => {
      if (!regex.test(formEntry.value)) errors.push(msg);
    });
    if (errors.length) formEntry.errors = errors;
    else formEntry.isValid = true;
  };
  const displayErrors = (errors: string[]) => errors.join(' ');

  const sendMail = async (): Promise<void> => {
    let body;

    if (honeypotRef.value?.value) {
      // Catch honeypot and log server-side
      body = JSON.stringify({ honeypot: 'Busted' });
      if (!isUserOptedOut) matomo.value?.trackEvent('Email form', 'Send', 'Honeypot');
    } else {
      // Process non-bot data
      const flattenValidateFormValues = (): EmailRequestBody => {
        const result = {} as EmailRequestBody;
        for (const key of Object.keys(form)) {
          const _key = key as keyof EmailForm;
          if (_key !== 'name') validateField(_key);
          result[_key] = form[_key].value;
        }
        return result;
      };
      const processedForm = flattenValidateFormValues();
      // Early return if someone bypassed validation by enabling the button
      if (Object.keys(form).some((key) => !form[key as keyof EmailForm].isValid)) {
        if (!isUserOptedOut) matomo.value?.trackEvent('Email form', 'Send', 'Sidestepped Validation');
        return;
      }
      body = JSON.stringify(processedForm);
    }
    sendPending.value = true;
    const response = await baseFetch('contact', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });

    const message = await response.json();
    sendPending.value = false;
    emailResponse.value = message;

    // Let response show briefly
    setTimeout(
      () => {
        if (message.success) {
          if (!isUserOptedOut) matomo.value?.trackEvent('Email form', 'Send', 'Success');
          closeCb();
        } else {
          if (!isUserOptedOut) matomo.value?.trackEvent('Email form', 'Send', 'Failed');
        }
        emailResponse.value = null;
      },
      message.success ? 1500 : 3000
    );
  };

  onMounted(async () => {
    const { data } = await getContentfulEntry<IDetailsFields>('/3n0vTvj2hNSyPdCLrUE675');
    console.log(data.value);
    if (data.value) content.value = data.value;
  });
</script>

<style lang="postcss">
  .modal:has(.email-form) {
    display: flex;
    justify-content: center;
    align-items: center;

    .modal__close {
      top: 36px;
    }
  }
  .email-form {
    width: 95%;
    max-width: 1024px;
    padding: var(--gutter);
    position: relative;
    background-color: var(--black);
    border: 1px solid var(--white);
    color: var(--white);

    @media (width >= 600px) {
      width: 90dvw;
    }

    &__heading {
      margin-top: 50px;
      font-family: var(--f-mono);
      font-size: clamp(2rem, 4vw, 3rem);
      text-align: center;
      text-transform: uppercase;

      @media (width >= 600px) {
        margin-top: 35px;
      }
    }

    &__copy {
      margin: 20px 0 35px;
      font-size: 1rem;
      text-align: center;
    }

    &__button {
      width: 100%;
      margin-top: 40px;
      background-color: var(--green-bold);
      font-size: 1.25rem;

      &:not(:disabled):hover {
        cursor: pointer;
        background-color: var(--blue-bold);
      }

      &:disabled {
        border: none;
        background-color: rgb(from var(--green-bold) r g b / 50%);
      }
    }

    &__disclaimer {
      font-size: 0.75rem;
    }

    &__error-message {
      color: var(--red-bold);
    }

    label,
    input,
    textarea {
      display: block;
      width: 100%;
    }
    input,
    textarea {
      margin-top: 5px;
      padding: 0.75rem 1rem;
      border: none;
      background-color: var(--off-black);
      color: var(--white);
      font-family: var(--f-mono);
      font-size: 1rem;
      transition: outline 0.2s ease-in-out;

      &::placeholder {
        color: rgb(from var(--white) r g b / 50%);
      }

      &:focus {
        outline: 2px solid var(--blue-bold);
      }

      &.invalid {
        border: 2px solid var(--red-bold);
      }
    }
    textarea {
      min-height: 6rem;
      field-sizing: content;
      resize: vertical;
    }
    label {
      margin: 20px auto;
      font-size: 1rem;
    }
  }

  .res-message {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    backdrop-filter: blur(var(--blur-amount));

    &__container {
      max-width: 500px;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
      margin: 0 var(--gutter);
    }

    &__icon {
      width: 115px;
      margin-bottom: 25px;
    }

    &__heading {
      font-family: var(--f-mono);
      margin-bottom: 10px;
      text-transform: capitalize;
    }

    &__content {
      grid-column: 1/-1;
      grid-row: 1/-1;
      padding: 32px;
      background-color: var(--off-black);
      box-shadow: 0 0 10px var(--black);
      font-size: 1.25rem;
      text-align: center;
    }
  }

  .vh {
    position: absolute;
    left: -200dvw;
    opacity: 0 !important;
  }
</style>
