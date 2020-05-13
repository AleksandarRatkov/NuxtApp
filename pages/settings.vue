<template>
<v-container grid-list-xl text-xs-center>
    <v-layout class="settings">
        <v-flex md10 offset-md1>
            <v-alert v-model="showSuccess" transition="scale-transition" dismissible color="green" border="left" elevation="20" colored-border icon="mdi-checkbox-marked-circle-outline">
                {{$t('settings.alert')}} </v-alert>
            <v-card height="fix-content" elevation="18">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-img v-if="isProfileImageUrlValid" :src="userProfile.profileImageUrl" alt="logoImage"></v-img>
                        <v-icon v-if="!isProfileImageUrlValid" large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{$t('settings.title')}}</v-list-item-title>
                        <v-list-item-subtitle>{{$t('settings.subtitle')}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <ValidationObserver v-slot="{ invalid }">
                    <v-form @submit.prevent>
                        <v-card-text>
                            <ValidationProvider v-slot="{ errors }" name="name" rules="required">
                                <v-text-field v-model="userProfile.name" :error-messages="errors" :label="$t('form.name')" name="name" prepend-icon="person" type="text" />
                            </ValidationProvider>
                            <ValidationProvider v-slot="{ errors }" name="title" rules="required">
                                <v-text-field v-model="userProfile.title" :error-messages="errors" :placeholder="userProfile.title" :label="$t('form.title')" name="title" prepend-icon="domain" type="text" />
                            </ValidationProvider>
                            <ValidationProvider v-slot="{ errors }" rules="validateImageUrl">
                                <v-text-field v-model="userProfile.profileImageUrl" :error-messages="errors" :placeholder="$t('form.imageUrl')" :label="$t('form.imageUrl')" name="imageUrl" prepend-icon="mdi-file-image" type="text" />
                            </ValidationProvider>
                            <v-btn class="white--text" min-width="100px" color="primary" :disabled="invalid" @click="updateUserProfile">
                                {{$t('form.updateProfile')}}
                            </v-btn>
                        </v-card-text>
                    </v-form>
                </ValidationObserver>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    mapState,
    mapActions
} from "vuex";
import {
    required,
} from 'vee-validate/dist/rules'
import {
    extend,
    ValidationProvider,
    ValidationObserver
} from 'vee-validate'

const isImageUrl = require('is-image-url');

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('validateImageUrl', {
    message: 'Profile image url needs to be valid!',
    validate: value => {
        return isImageUrl(value);
    }
})

export default {
    name: 'Settings',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            showSuccess: false,
        };
    },
    computed: {
        ...mapState({
            userProfile: state => state.user.userProfile,
        }),
        isProfileImageUrlValid() {
            return isImageUrl(this.userProfile.profileImageUrl);
        }
    },
    methods: {
        ...mapActions({
            updateProfile: 'user/updateProfile'
        }),
        updateUserProfile() {
            this.updateProfile({
                name: this.userProfile.name,
                title: this.userProfile.title,
                profileImageUrl: this.userProfile.profileImageUrl,
            });

            this.showSuccess = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.settings {
    padding-top: 5vh;
}
</style>
