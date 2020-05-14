<template>
<v-container fluid class="background">
    <v-layout row>
        <v-flex md6 class="full-height">
            <h1>Vuegram</h1>
            <p class="login-text">
                {{$t('login.welcome')}}
            </p>
        </v-flex>

        <v-flex md6 class="full-height">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="10" md="10">
                    <v-card class="elevation-12" v-show="showLoginForm">
                        <v-toolbar src="/images/background.webp" dark flat>
                            <v-toolbar-title>{{$t('login.loginForm')}}</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">{{$t('login.loading')}}</v-progress-circular>
                        </v-flex>
                        <v-alert v-model="showLoginError" transition="scale-transition" dismissible color="red" border="left" elevation="10" colored-border icon="mdi-alert-circle-outline">
                            {{errorMsg}} </v-alert>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-form @submit.prevent>
                                <v-card-text v-if="!performingRequest">
                                    <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                        <v-text-field v-model="loginForm.email" :label="$t('form.email')" :error-messages="errors" required name="loginEmail" prepend-icon="person" />
                                    </ValidationProvider>

                                    <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:6">
                                        <v-text-field :type="showLoginPassword ? 'text' : 'password'" @click:append="showLoginPassword = !showLoginPassword" :append-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="loginForm.password" id="loginPassword" :error-messages="errors" :label="$t('form.password')" name="password" prepend-icon="lock" />
                                    </ValidationProvider>
                                </v-card-text>
                                <v-flex md4 offset-md4>
                                    <v-card-text @click="loginWithGoogle">
                                        <v-avatar size="40" class="logo">
                                            <v-img src="/images/google-logo.png" alt="logoImage"></v-img>
                                        </v-avatar>
                                        <h4 class="sign-in">{{$t('login.signIn')}}</h4>
                                    </v-card-text>
                                </v-flex>
                                <v-card-actions>
                                    <v-btn text color="primary" @click="togglePasswordReset">{{$t('login.forgot')}}</v-btn>
                                    <v-btn text color="primary" @click="toggleForm">{{$t('login.createAccount')}}</v-btn>
                                    <v-spacer />
                                    <v-btn :disabled="invalid" class="white--text" color="primary" @click="login">{{$t('login.login')}}</v-btn>
                                </v-card-actions>
                            </v-form>
                        </ValidationObserver>
                    </v-card>

                    <v-card class="elevation-12" v-show="!showLoginForm && !showForgotPassword">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>{{$t('login.signUpForm')}}</v-toolbar-title>
                        </v-toolbar>
                        <v-flex class="position" md4 offset-md4>
                            <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">{{$t('login.loading')}}</v-progress-circular>
                        </v-flex>
                        <v-alert v-model="showSignUpError" transition="scale-transition" dismissible color="red" border="left" elevation="10" colored-border icon="mdi-alert-circle-outline">
                            {{errorMsg}} </v-alert>
                        <ValidationObserver v-slot="{ invalid }">
                            <v-form @submit.prevent>
                                <v-card-text v-if="!performingRequest">
                                    <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                                        <v-text-field v-model="signupForm.name" :error-messages="errors" required :label="$t('form.name')" name="name" prepend-icon="person" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="title" rules="required">
                                        <v-text-field v-model="signupForm.title" :error-messages="errors" :label="$t('form.title')" name="title" prepend-icon="domain" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                        <v-text-field v-model="signupForm.email" :error-messages="errors" required :label="$t('form.email')" name="signupEmail" prepend-icon="email" type="text" />
                                    </ValidationProvider>
                                    <ValidationProvider v-slot="{ errors }" name="password" rules="required|min:6">
                                        <v-text-field :type="showSignupPassword ? 'text' : 'password'" @click:append="showSignupPassword = !showSignupPassword" :append-icon="showSignupPassword ? 'mdi-eye' : 'mdi-eye-off'" v-model="signupForm.password" :error-messages="errors" id="signUpPassword" :label="$t('form.password')" name="password" prepend-icon="lock" />
                                    </ValidationProvider>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn text color="primary" @click="toggleForm">{{$t('login.backToLogin')}}</v-btn>
                                    <v-btn :disabled="invalid" class="white--text" color="primary" @click="signup">{{$t('login.signUp')}}</v-btn>
                                </v-card-actions>
                            </v-form>
                        </ValidationObserver>
                    </v-card>
                    <v-card class="elevation-12" v-show="showForgotPassword">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>{{$t('login.passReset')}}</v-toolbar-title>
                        </v-toolbar>

                        <v-flex md4 offset-md4>
                            <v-flex class="position" md4 offset-md4>
                                <v-progress-circular :size="120" color="primary" indeterminate v-if="performingRequest">{{$t('login.loading')}}</v-progress-circular>
                            </v-flex>
                        </v-flex>
                        <v-alert v-model="showPasswordError" transition="scale-transition" dismissible color="red" border="left" elevation="10" colored-border icon="mdi-alert-circle-outline">
                            {{errorMsg}} </v-alert>
                        <v-card-text v-if="!performingRequest">
                            <v-card-text>{{$t('login.passResetEmail')}}</v-card-text>
                            <v-form @submit.prevent>
                                <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
                                    <v-text-field v-model="passwordForm.email" :error-messages="errors" required :label="$t('form.email')" name="forgotEmail" prepend-icon="person" type="text" />
                                </ValidationProvider>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text color="primary" @click="togglePasswordReset">{{$t('login.backToLogin')}}</v-btn>
                            <v-btn class="white--text" color="primary" @click="resetPassword">{{$t('login.submit')}}</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    mapMutations,
    mapActions
} from 'vuex'
import {
    required,
    email,
    min
} from 'vee-validate/dist/rules'
import {
    extend,
    ValidationProvider,
    ValidationObserver
} from 'vee-validate'

import {
    auth,
    usersCollection
} from '~/plugins/firebase.js'
import firebase from 'firebase';

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('email', {
    ...email,
    message: 'Email must be valid',
})

extend('min', {
    ...min,
    message: '{_field_} must be greater than {length} characters',
})

export default {
    name: 'Login',
    layout: 'login',
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
            setCurrentUserId: 'user/setCurrentUserId',
        }),
        ...mapActions({
            fetchUserProfile: 'user/fetchUserProfile'
        }),
        setPerformingRequest(value) {
            this.performingRequest = value;
        },
        login() {
            this.setPerformingRequest(true);
            auth
                .signInWithEmailAndPassword(
                    this.loginForm.email,
                    this.loginForm.password
                )
                .then(user => {
                    this.setCurrentUserId(user.user.uid);
                    this.afterSuccessfulLogin();
                })
                .catch(err => {
                    console.log(err);
                    this.showLoginError = true;
                    this.errorMsg = err.message;
                    this.setPerformingRequest(false);
                });
        },
        afterSuccessfulLogin() {
            this.fetchUserProfile();
            this.$router.push({
                path: "/"
            });
            this.setPerformingRequest(false);
        },
        loginWithGoogle() {
            this.setPerformingRequest(true);
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then((user) => {
                this.checkIfUserExist(user.user);
            }).catch((err) => {
                console.log(err);
                this.showLoginError = true;
                this.errorMsg = err.message;
                this.setPerformingRequest(false);
            });
        },
         checkIfUserExist(user) {
            usersCollection.doc(user.uid).get().then(res => {
                if (!res.exists) {
                    this.addUserToDb(user, user.displayName, '');
                } else {
                    this.afterSuccessfulLogin();
                }
            }).catch(err => {
                console.log(err)
            })
        },
        signup() {
            this.setPerformingRequest(true);

            auth
                .createUserWithEmailAndPassword(
                    this.signupForm.email,
                    this.signupForm.password
                )
                .then(user => {
                    this.addUserToDb(user.user, this.signupForm.name, this.signupForm.title)
                })
                .catch(err => {
                    console.log(err);
                    this.showSignUpError = true;
                    this.errorMsg = err.message;
                    this.setPerformingRequest(false);
                });
        },
        addUserToDb(user, name, title) {
            let userId = user.uid;
            this.setCurrentUserId(userId);
            usersCollection
                .doc(userId)
                .set({
                    name: name,
                    title: title,
                    following: []
                })
                .then(() => {
                    this.afterSuccessfulLogin();
                })
                .catch(err => {
                    console.log(err);
                    this.errorMsg = err.message;
                });
        },
        resetPassword() {
            this.performingRequest = true;

            auth
                .sendPasswordResetEmail(this.passwordForm.email)
                .then(() => {
                    this.performingRequest = false;
                    this.passwordResetSuccess = true;
                    this.passwordForm.email = "";
                })
                .catch(err => {
                    console.log(err);
                    this.showPasswordError = true;
                    this.performingRequest = false;
                    this.errorMsg = err.message;
                });
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
}
</script>

<style lang="scss" scoped>
$primary: #1565C0;
$white: #fff;

.position {
    margin-top: 40px;
    margin-bottom: 40px;
}

.full-height {
    color: white;
    height: 100vh;
    padding-top: 30vh;
}

.background {
    background-image: url('/images/background.webp');
    background-size: 50vw 100vh;
    padding-left: 20vh;
}

.login-text {
    max-width: 490px;
    margin-top: 2rem;
    line-height: 1.8;
    font-family: "Open Sans", sans-serif;
}

h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem;
    font-family: "Open Sans", sans-serif;
}

.full-height a {
    color: #fff;
}

.logo {
    margin-left: 40px;
    cursor: pointer;
}

.sign-in {
    color: #0d76eb;
    margin-top: 10px;
    cursor: pointer;
}

.v-alert {
    margin-left: 10px;
    margin-right: 10px;
}
</style>
