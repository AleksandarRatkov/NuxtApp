<template>
  <v-row no-gutters>
    <v-col md="6" cols="12">
      <v-row align="center" justify="center" class="background full-screen">
        <v-col cols="6" md="6">
          <div>
            <h1 dark>Vuegram</h1>
            <p class="login-text">
              {{ $t("login.welcome") }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <v-col class="align-content-space-between layout wrap" cols="12" md="6">
      <v-row align="center" justify="center" class="ma-0 full-screen">
        <v-col cols="12" md="10" v-show="showLoginForm" class="forms">
          <v-card class="elevation-12">
            <v-toolbar src="/images/background.webp" dark flat>
              <v-toolbar-title>{{ $t("login.loginForm") }}</v-toolbar-title>
            </v-toolbar>
            <v-flex class="position" md4 offset-md4>
              <v-progress-circular
                :size="120"
                color="primary"
                indeterminate
                v-if="performingRequest"
                >{{ $t("login.loading") }}</v-progress-circular
              >
            </v-flex>
            <v-alert
              v-model="showLoginError"
              transition="scale-transition"
              dismissible
              color="red"
              border="left"
              elevation="10"
              colored-border
              icon="mdi-alert-circle-outline"
            >
              {{ errorMsg }}
            </v-alert>
            <ValidationObserver v-slot="{ invalid }">
              <v-form @submit.prevent>
                <v-card-text v-if="!performingRequest">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="email"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="loginForm.email"
                      :label="$t('form.email')"
                      :error-messages="errors"
                      required
                      name="loginEmail"
                      prepend-icon="person"
                    />
                  </ValidationProvider>

                  <ValidationProvider
                    v-slot="{ errors }"
                    name="password"
                    rules="required|min:6"
                  >
                    <v-text-field
                      :type="showLoginPassword ? 'text' : 'password'"
                      @click:append="showLoginPassword = !showLoginPassword"
                      :append-icon="
                        showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      v-model="loginForm.password"
                      id="loginPassword"
                      :error-messages="errors"
                      :label="$t('form.password')"
                      name="password"
                      prepend-icon="lock"
                    />
                  </ValidationProvider>
                </v-card-text>
                <v-col md4 offset-md4 align="center" justify="center">
                  <v-card-text @click="loginWithGoogle" class="logo">
                    <v-avatar size="40">
                      <v-img
                        src="/images/google-logo.png"
                        alt="logoImage"
                      ></v-img>
                    </v-avatar>
                    <h4 class="sign-in">{{ $t("login.signIn") }}</h4>
                  </v-card-text>
                </v-col>
                <v-card-actions>
                  <v-btn text color="primary" @click="togglePasswordReset">{{
                    $t("login.forgot")
                  }}</v-btn>
                  <v-btn text color="primary" @click="toggleForm">{{
                    $t("login.createAccount")
                  }}</v-btn>
                  <v-spacer />
                  <v-btn
                    :disabled="invalid"
                    class="white--text"
                    color="primary"
                    @click="login"
                    >{{ $t("login.login") }}</v-btn
                  >
                </v-card-actions>
              </v-form>
            </ValidationObserver>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="10"
          v-show="!showLoginForm && !showForgotPassword"
          class="forms"
        >
          <v-card class="elevation-12">
            <v-toolbar src="/images/background.webp" dark flat>
              <v-toolbar-title>{{ $t("login.signUpForm") }}</v-toolbar-title>
            </v-toolbar>
            <v-flex class="position" md4 offset-md4>
              <v-progress-circular
                :size="120"
                color="primary"
                indeterminate
                v-if="performingRequest"
                >{{ $t("login.loading") }}</v-progress-circular
              >
            </v-flex>
            <v-alert
              v-model="showSignUpError"
              transition="scale-transition"
              dismissible
              color="red"
              border="left"
              elevation="10"
              colored-border
              icon="mdi-alert-circle-outline"
            >
              {{ errorMsg }}
            </v-alert>
            <ValidationObserver v-slot="{ invalid }">
              <v-form @submit.prevent>
                <v-card-text v-if="!performingRequest">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="name"
                    rules="required"
                  >
                    <v-text-field
                      v-model="signupForm.name"
                      :error-messages="errors"
                      required
                      :label="$t('form.name')"
                      name="name"
                      prepend-icon="person"
                      type="text"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="title"
                    rules="required"
                  >
                    <v-text-field
                      v-model="signupForm.title"
                      :error-messages="errors"
                      :label="$t('form.title')"
                      name="title"
                      prepend-icon="domain"
                      type="text"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="email"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="signupForm.email"
                      :error-messages="errors"
                      required
                      :label="$t('form.email')"
                      name="signupEmail"
                      prepend-icon="email"
                      type="text"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="password"
                    rules="required|min:6"
                  >
                    <v-text-field
                      :type="showSignupPassword ? 'text' : 'password'"
                      @click:append="showSignupPassword = !showSignupPassword"
                      :append-icon="
                        showSignupPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      v-model="signupForm.password"
                      :error-messages="errors"
                      id="signUpPassword"
                      :label="$t('form.password')"
                      name="password"
                      prepend-icon="lock"
                    />
                  </ValidationProvider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text color="primary" @click="toggleForm">{{
                    $t("login.backToLogin")
                  }}</v-btn>
                  <v-btn
                    :disabled="invalid"
                    class="white--text"
                    color="primary"
                    @click="signup"
                    >{{ $t("login.signUp") }}</v-btn
                  >
                </v-card-actions>
              </v-form>
            </ValidationObserver>
          </v-card>
        </v-col>
        <v-col cols="12" md="10" v-show="showForgotPassword" class="forms">
          <v-card class="elevation-12">
            <v-toolbar src="/images/background.webp" dark flat>
              <v-toolbar-title>{{ $t("login.passReset") }}</v-toolbar-title>
            </v-toolbar>

            <v-flex md4 offset-md4>
              <v-flex class="position" md4 offset-md4>
                <v-progress-circular
                  :size="120"
                  color="primary"
                  indeterminate
                  v-if="performingRequest"
                  >{{ $t("login.loading") }}</v-progress-circular
                >
              </v-flex>
            </v-flex>
            <v-alert
              v-model="showPasswordError"
              transition="scale-transition"
              dismissible
              color="red"
              border="left"
              elevation="10"
              colored-border
              icon="mdi-alert-circle-outline"
            >
              {{ errorMsg }}
            </v-alert>
            <v-card-text v-if="!performingRequest">
              <v-card-text>{{ $t("login.passResetEmail") }}</v-card-text>
              <v-form @submit.prevent>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="passwordForm.email"
                    :error-messages="errors"
                    required
                    :label="$t('form.email')"
                    name="forgotEmail"
                    prepend-icon="person"
                    type="text"
                  />
                </ValidationProvider>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text color="primary" @click="togglePasswordReset">{{
                $t("login.backToLogin")
              }}</v-btn>
              <v-btn
                class="white--text"
                color="primary"
                @click="resetPassword"
                >{{ $t("login.submit") }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { required, email, min } from "vee-validate/dist/rules";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";

import { auth, usersCollection } from "~/plugins/firebase.js";

extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});

extend("email", {
  ...email,
  message: "Email must be valid"
});

extend("min", {
  ...min,
  message: "{_field_} must be greater than {length} characters"
});

export default {
  name: "Login",
  layout: "login",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  asyncData() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        title: "",
        email: "",
        password: ""
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      performingRequest: false,
      errorMsg: "",
      showLoginPassword: false,
      showSignupPassword: false,
      userExists: false,
      showLoginError: false,
      showSignUpError: false,
      showPasswordError: false
    };
  },
  methods: {
    ...mapMutations({
      setCurrentUserId: "user/setCurrentUserId"
    }),
    ...mapActions({
      fetchUserProfile: "user/fetchUserProfile",
      loginUser: "user/login",
      loginUserWithGoogle: "user/loginWithGoogle",
      signUpUser: "user/signup",
      resetUserPassword: "user/resetPassword"
    }),
    setPerformingRequest(value) {
      this.performingRequest = value;
    },
    async login() {
      this.setPerformingRequest(true);
      try {
        await this.loginUser(this.loginForm);
        this.afterSuccessfulAuth();
      } catch (error) {
        this.showErrorMessage(error, this.showLoginForm);
      }
    },
    showErrorMessage(error, form) {
      console.log(error);
      form = true;
      this.errorMsg = error.message;
      this.setPerformingRequest(false);
    },
    afterSuccessfulAuth() {
      this.$router.push({ path: "/" });
      this.setPerformingRequest(false);
    },
    async loginWithGoogle() {
      try {
        await this.loginUserWithGoogle();
        this.afterSuccessfulAuth();
      } catch (error) {
        this.showErrorMessage(error, this.showLoginForm);
      }
    },
    async signup() {
      this.setPerformingRequest(true);
      try {
        await this.signUpUser(this.signupForm);
        this.afterSuccessfulAuth();
      } catch (error) {
        this.showErrorMessage(error, this.showSignUpError);
      }
    },
    async resetPassword() {
      this.performingRequest = true;
      try {
        await this.resetUserPassword(this.passwordForm.email);
        this.performingRequest = false;
        this.passwordResetSuccess = true;
        this.passwordForm.email = "";
      } catch (error) {
        this.showErrorMessage(error, this.showPasswordError);
      }
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
      }
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
      this.errorMsg = "";
    }
  }
};
</script>

<style lang="scss" scoped>
$primary: #1565c0;
$white: #fff;
$font: "Open Sans", sans-serif;

.full-screen {
  height: 100vh;
}

.background {
  background-image: url("/images/background.webp");
  background-size: cover;
}

@media (max-width: 490px) {
  .background {
    width: 468px;
  }
  .forms {
    width: 458px;
  }
}

.login-text {
  max-width: 490px;
  margin-top: 2rem;
  line-height: 1.8;
  font-family: $font;
  color: $white;
}

h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
  font-family: $font;
  color: $white;
}

.logo {
  cursor: pointer;
}

.v-alert {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
