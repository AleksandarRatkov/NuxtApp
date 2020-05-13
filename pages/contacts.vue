<template>
<v-container fluid>
    <v-row>
        <v-col v-for="(user, index) in fetchedUsers" :key="index" cols="4">
            <v-card class="mx-auto profile" max-width="344">
                <v-img class="image" v-if="user.profileImageUrl" :src="user.profileImageUrl"></v-img>
                <v-img class="image" v-if="!user.profileImageUrl" src="/images/defaultUser.png"></v-img>

                <v-card-title>
                    {{user.name}}
                </v-card-title>

                <v-card-subtitle>
                    {{user.title}}
                </v-card-subtitle>

                <v-card-actions class="justify-center">
                    <v-btn color="primary" @click="followUser(user.id)">{{ $t(userProfile.following.includes(user.id) ? 'contacts.unfollow' : 'contacts.follow')}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    mapActions,
    mapState,
} from 'vuex'
import _ from 'lodash';

export default {
    name: "Contacts",
    created() {
        this.getOtherUsers();
    },
    computed: {
        ...mapState({
            fetchedUsers: state => state.user.users,
            userProfile: state => state.user.userProfile
        })
    },
    methods: {
        ...mapActions({
            getOtherUsers: 'user/fetchUsersBeside',
            updateProfileFollowing: 'user/updateProfileFollowing',
            fetchUserProfile: 'user/fetchUserProfile'
        }),
        isUserFollowed(userId) {
            return _.includes(this.userProfile.following, userId);
        },
        followUser(userId) {
            if (_.includes(this.userProfile.following, userId)) {
                _.remove(this.userProfile.following, id => {
                    return id === userId;
                })
            } else {
                this.userProfile.following.push(userId);
            }

            this.updateProfileFollowing({
                following: this.userProfile.following
            }).then(() => {
                this.fetchUserProfile();
            });
        }
    },
}
</script>

<style lang="scss" scoped>
.image {
    height: 344px;
}
</style>
