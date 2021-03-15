<template>
  <span data-token="true" class="added-token" contenteditable="false"
  
  >{{textToken}}
  </span> 
</template>

<script>

export default {
  name: 'addedToken',
  props: {
    textToken: String,
    tokenId: String,
  },
  data() {
    return {
      
    }
  },
  computed: {

  },
  methods: {
    
  },
  watch: {

  },
}
</script>

<style lang="postcss">

.added-token {
    display: inline-block;
    padding: 2px 4px;
    background-color: transparent;
    font-weight: bolder;
    letter-spacing: 0.05rem;
    border: 2px dashed green;
    margin: 0 3px;
    font-size: 12px;
    outline: none;
  }
</style>
