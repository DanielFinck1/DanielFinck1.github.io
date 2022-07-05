<template> 
  <div class="container">
    <h1>Troy Tutors - Collabhub</h1>
    <div class="row justify-content-between">
      <div class="col-5 whiteboard">
        <router-link :to="'/Whiteboard'">
          <img class="image" src="../collabboardimage.png" alt="collab board image"/>
        </router-link>
      </div>
      <div class="col-5 codeboard">
        <router-link class="code" :to="'/Codeboard'">
          <img class="image" src="../codeboardimage.png" alt="code board image"/>
          <h3>Code Board</h3>
        </router-link>
      </div>
    </div>
  </div>

</template>


<style scoped>

  h1 {
    color: #DC1C13;
    margin-top: 30px;
    padding-bottom: 50px;
    text-align: center;
  }

  .code{
    color: black;
    text-decoration: none;
  }

  h3 {
    padding-top: 10px;
  }
  .image {
    width: 100%;
    border-radius: 10px;
  }
  .whiteboard {
    border: 1px solid black;
    border-radius: 10px;
    margin-left: 50px;
  }
  .codeboard {
    border: 1px solid black;
    border-radius: 10px;
    margin-right: 50px;
  }

  Footer {
    position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
  }
  

</style>