<template>
<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app src="/images/background.webp" dark>
    <v-app-bar-nav-icon @click.native="setDrawer(!drawer)" />
    <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{$t('navbar.welcome')}}</span>
    </v-toolbar-title>
    <v-text-field flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" :label="$t('navbar.search')" class="hidden-sm-and-down" />
    <v-spacer />
    <v-badge bordered bottom color="green accent-4" dot offset-x="10" offset-y="10">
        <v-avatar left size="40">
            <!-- <v-img v-if="userProfile.profileImageUrl" :src="userProfile.profileImageUrl" alt="logoImage"></v-img> -->
            <v-icon large>mdi-account-circle</v-icon> 
        </v-avatar>
    </v-badge>

    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <!-- <v-btn right text v-on="on" @click="logout"> -->
            <v-btn right text v-on="on">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </template>
        <span>{{$t('navbar.logout')}}</span>
    </v-tooltip>
    <div class="locale">
        <v-select v-model="$i18n.locale" :items="langs" item-value="locale" item-text="lang" outlined></v-select>
    </div>
</v-app-bar>
</template>

<script>
import {
    mapState,
    mapMutations,
    // mapActions
} from 'vuex'

// import {
//     auth
// } from '~/plugins/firebaseConfig.js'

export default {
    name: 'Navbar',
    data() {
        return {
            langs: [{
                    locale: 'en',
                    lang: 'En'
                },
                {
                    locale: 'sr',
                    lang: 'Sr'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            // userProfile: state => state.user.userProfile,
            drawer: state => state.drawer
        }),
    },
    methods: {
        ...mapMutations({
            setDrawer: 'setDrawer'
            }),
    //     ...mapActions(['clearData']),
    //     logout() {
    //         auth.signOut()
    //             .then(() => {
    //                 this.clearData();
    //                 this.$router.push("/login");
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     }
    },
}
</script>

<style lang="scss" scoped>
.locale {
    width: 75px;
    height: 58px;
}
</style>
