<template>
<v-container fluid>
    <v-layout column>
        <v-flex md12>
            <v-card height="fix-content" class="mx-auto" elevation="18">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-img v-if="userProfile.profileImageUrl" :src="userProfile.profileImageUrl" alt="logoImage"></v-img>
                        <v-icon v-if="!userProfile.profileImageUrl" large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{userProfile.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{ userProfile.title }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-text>
                    <v-textarea rows="3" v-model.trim="post.content" outlined :placeholder="$t('dashboard.onYourMind')"></v-textarea>
                    <v-btn class="white--text" min-width="100px" color="primary" :disabled="post.content===''" @click="createPost">{{$t('dashboard.post')}}</v-btn>
                </v-card-text>
            </v-card>
            <v-divider vertical></v-divider>
        </v-flex>
        <v-flex v-for="(post,index) in posts" :key="index">
            <v-card height="fix-content" class="mx-auto" elevation="18">
                <v-list-item>
                    <v-list-item-avatar>
                        <v-img v-if="post.profileImageUrl" :src="post.profileImageUrl" alt="logoImage"></v-img>
                        <v-icon v-if="!post.profileImageUrl" large>mdi-account-circle</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="headline">{{post.userName}}</v-list-item-title>
                        <v-list-item-subtitle>{{ post.createdOn | formatDate }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-text>
                    <span :class="{pointer : post.content.length>200 }" v-if="!isFullPost || post.id !== fullPostId" @click="showFullPost(post.id)">{{post.content | trimLength}}</span>
                    <span :class="{pointer : post.content.length>200 }" v-if="isFullPost && post.id === fullPostId" @click="showFullPost(post.id)">{{post.content}}</span>
                </v-card-text>

                <v-card-actions>
                    <v-btn text color="primary" @click="showCommentForm(post.id)">{{$t('dashboard.addComment')}}</v-btn>
                    <v-btn text color="primary">
                        <v-btn icon :color="didUserLikedPost(post.usersWhoLiked) ? 'red' : 'grey'" @click="likePost(post)">
                            <v-icon>mdi-heart</v-icon>
                        </v-btn>
                        {{post.likes}}
                    </v-btn>
                    <v-btn text color="primary" :disabled="post.comments === 0" @click="showAllComments(post)">{{ $t(post.id === currentCommentId ? 'dashboard.hideComments' : 'dashboard.showComments')}}({{post.comments}})</v-btn>
                </v-card-actions>

                <v-flex md4 offset-md1>
                    <v-progress-circular :size="50" color="primary" indeterminate v-if="post.id === currentCommentId && loadingComents"></v-progress-circular>
                </v-flex>
                <v-flex md12 v-if="post.id === currentCommentId && !loadingComents">
                    <v-card class="comments" shaped height="fix-content" v-for="(comment,index) in postComments" :key="index">
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-img v-if="comment.profileImageUrl" :src="comment.profileImageUrl" alt="logoImage"></v-img>
                                <v-icon v-if="!comment.profileImageUrl" large>mdi-account-circle</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title class="headline">{{comment.userName}}</v-list-item-title>
                                <v-list-item-subtitle>{{ comment.createdOn | formatDate }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-card-text>{{ comment.content }}</v-card-text>
                    </v-card>
                </v-flex>
                <br />

                <v-card-actions v-if="post.id === currentPostId">
                    <v-textarea rows="1" v-model.trim="comment.content" outlined :placeholder="$t('dashboard.addComment')"></v-textarea>
                    <v-btn @click="addComment(post)" text color="primary" :disabled="comment.content === ''">{{$t('dashboard.addComment')}}</v-btn>
                </v-card-actions>
            </v-card>
            <v-divider vertical></v-divider>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import {
    mapState,
    mapActions,
} from "vuex";
// import moment from "moment";
// import _ from 'lodash';
import {
    postsCollection,
    commentsCollection
} from '~/plugins/firebase.js'

export default {
    meta: {
        requiresAuth: true
    },
    asyncData() {
        return {
            post: {
                content: ""
            },
            comment: {
                postId: "",
                userId: "",
                content: "",
                postComments: 0
            },
            showPostModal: false,
            postComments: [],
            currentPostId: '',
            currentCommentId: '',
            isFullPost: false,
            fullPostId: '',
            loadingComents: false,
        };
    },
    created() {
        this.fetchAllPosts();
    },
    computed: {
        ...mapState({
            userProfile: state => state.user.userProfile,
            posts: state => state.post.posts,
        }),
    },
    methods: {
        ...mapActions({
            fetchAllPosts: 'post/fetchAllPosts',
            fetchUserProfile: 'user/fetchUserProfile'
        }),
        didUserLikedPost(usersWhoLiked) {
            return _.includes(usersWhoLiked, this.userProfile.id);
        },
        showFullPost(postId) {
            if (postId === this.fullPostId) {
                this.isFullPost = false
                this.fullPostId = ''
            } else {
                this.isFullPost = true
                this.fullPostId = postId
            }
        },
        showAllComments(post) {
            if (this.currentCommentId === post.id) {
                this.currentCommentId = ''
            } else {
                this.currentPostId = ''
                this.currentCommentId = post.id
                this.viewPost(post)
            }

        },
        showCommentForm(postId) {
            if (this.currentPostId === postId) {
                this.currentPostId = ''
            } else {
                this.currentPostId = postId
                this.comment.content = ''
                this.currentCommentId = ''
            }
        },
        createPost() {
            postsCollection
                .add({
                    createdOn: new Date(),
                    content: this.post.content,
                    userId: this.userProfile.id,
                    profileImageUrl: this.userProfile.profileImageUrl,
                    userName: this.userProfile.name,
                    comments: 0,
                    usersWhoLiked: [],
                    likes: 0
                })
                // eslint-disable-next-line no-unused-vars
                .then(ref => {
                    this.post.content = "";
                })
                .catch(err => {
                    console.log(err);
                });
        },
        addComment(post) {
            this.comment.postId = post.id;
            this.comment.userId = post.userId;
            this.comment.postComments = post.comments;

            let postId = this.comment.postId;
            let postComments = this.comment.postComments;

            commentsCollection
                .add({
                    createdOn: new Date(),
                    content: this.comment.content,
                    postId: postId,
                    userId: this.userProfile.id,
                    userName: this.userProfile.name,
                    profileImageUrl: this.userProfile.profileImageUrl,
                })
                // eslint-disable-next-line no-unused-vars
                .then(doc => {
                    postsCollection
                        .doc(postId)
                        .update({
                            comments: postComments + 1
                        })
                        .then(() => {
                            this.currentPostId = ''
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        likePost(post) {
            if (_.includes(post.usersWhoLiked, this.userProfile.id)) {
                _.remove(post.usersWhoLiked, id => {
                    return id === this.userProfile.id;
                })
            } else {
                post.usersWhoLiked.push(this.userProfile.id);
            }

            postsCollection.doc(post.id).update({
                usersWhoLiked: post.usersWhoLiked,
                likes: post.usersWhoLiked.length
            })
        },
        viewPost(post) {
            this.loadingComents = true;
            commentsCollection
                .where("postId", "==", post.id)
                .orderBy('createdOn', 'desc')
                .get()
                .then(docs => {
                    let commentsArray = [];

                    docs.forEach(doc => {
                        let comment = doc.data();
                        comment.id = doc.id;
                        commentsArray.push(comment);
                    });

                    this.postComments = commentsArray;
                    this.loadingComents = false;
                })
                .catch(err => {
                    this.loadingComents = false;
                    console.log(err);
                });
        }
    },
    filters: {
        formatDate(val) {
            if (!val) {
                return "-";
            }
            let date = val.toDate();
            return moment(date).fromNow();
        },
        trimLength(val) {
            if (val.length < 200) {
                return val;
            }
            return `${val.substring(0, 200)}...`;
        }
    }
};
</script>

<style lang="scss" scoped>
.pointer {
    cursor: pointer;
}

.comments {
    margin: 15px;
}
</style>
