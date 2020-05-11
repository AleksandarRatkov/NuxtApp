<template>
<v-navigation-drawer :value="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-list dense>
        <template v-for="item in items">
            <v-list-item :key="item.text" link>
                <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        <nuxt-link tag="div" :to="item.route"> {{ $t(item.text) }} </nuxt-link>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
    </v-list>
</v-navigation-drawer>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
    name: 'SideDrawer',
    data() {
        return {
            items: [{
                    icon: 'mdi-view-dashboard',
                    text: 'sideDrawer.homepage',
                    route: '/'
                },
                {
                    icon: 'mdi-contacts',
                    text: 'sideDrawer.contacts',
                    route: '/contacts'
                },
                {
                    icon: 'mdi-account-cog',
                    text: 'sideDrawer.settings',
                    route: '/settings'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            drawer: state => state.drawer
        })
    },
}
</script>

<style lang="scss" scoped>
</style>
