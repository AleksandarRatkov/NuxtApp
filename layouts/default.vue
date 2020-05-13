<template>
  <v-app>
    <side-drawer />
    <navbar />
    <v-content>
        <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';
import SideDrawer from '@/components/SideDrawer';

export default {
  name: 'Default',
  components: {
        Navbar,
        SideDrawer
    },
  data () {
    return {
    }
  }
}
</script>
