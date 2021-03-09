<template>
  <div id="app">
    <div class="editor">
      <!-- <pre>{{currentUser}}</pre> -->
      <div class="editor__side-menu">
        <div class="side-menu">
          <fieldset class="side-menu__fieldset">
            <legend class="side-menu__legend">Bret</legend>
            <div class="side-menu__button">
              <button class="btn btn_size_l btn_theme_calm"
                @click="loadUser()"
              >Загрузить случайного пользователя</button>
            </div>
            <label for="name" class="side-menu__label">Имя пользователя</label>
            <input id="name" 
              class="side-menu__input" 
              type="text"
              :value="currentUser.name ? currentUser.name : ''"
            >
            <label for="email" class="side-menu__label">Адрес e-mail</label>
            <input id="email" 
              class="side-menu__input" 
              type="text"
              :value="currentUser.email ? currentUser.email : ''"
            >
            <label for="phone" class="side-menu__label">Контактный телефон</label>
            <input id="phone" 
              class="side-menu__input" 
              type="text"
              :value="currentUser.phone ? currentUser.phone : ''"
            >
            <label for="site" class="side-menu__label">Основной веб-сайт</label>
            <input id="site" 
              class="side-menu__input" 
              type="text"
              :value="currentUser.site ? currentUser.site : ''"
            >
          </fieldset>
        </div>
      </div>
      <div class="editor__letter-configurator">
        <div class="tokens">
          <span class="tokens__text">Вставить токен: </span>
          <ul class="tokens__list">
            <li class="tokens__item">имя</li>
            <li class="tokens__item">email</li>
            <li class="tokens__item">телефон</li>
            <li class="tokens__item">сайт</li>
          </ul>
        </div>
        <div class="editor__letter-area">
          <div class="editor__letter" contenteditable="true">
            Hello darkness, my old <span class="editor__added-token">friend</span>,
            I've come to talk with you again,
            Because a <span class="editor__added-token">vision</span> softly creeping,
            Left its seeds while I was sleeping,
            And the vision that was planted in my brain
            Still remains
            Within the sound of silence
          </div>
        </div>        
        <div class="editor__btns">
          <button class="btn">Загрузить из localStorage</button>
          <button class="btn">Сохранить в localStorage</button>
        </div>
        <div class="editor__template">
          <div class="editor__ready-letter" contenteditable="true" readonly></div>
        </div>

      </div>
    </div>
  
  </div>
</template>

<script>
import all_users from '../src/users.json'
import {randomInteger} from './pure'

export default {
  name: 'App',
  data() {
    return {
      users: all_users,
      currentUser: {
        name: '',
        email: '',
        phone: '',
        site: '',
      },
    }
  },
  methods: {
    loadUser() {
      const usersAmount = this.users.length + 1;
      const userRandomNubder = randomInteger(usersAmount);
      this.currentUser = this.users[userRandomNubder];
    }
  }
}
</script>

<style lang="postcss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.editor {
  display: grid;
  grid-template-columns: 300px 1fr;

  &__side-menu {
    background-color: #aaa;
    padding: 10px;
  }
  &__letter-configurator {
    background-color: #ccc;
    padding: 10px 20px;
  }
  &__letter,
  &__ready-letter {
    width: 100%;
    min-height: 150px;
    padding: 10px;
    box-sizing: border-box;
    background-color:white;
  }
  &__tokens {
    display: flex;
  }
  &__btns {
    padding: 10px 0;
    text-align: left;
  }
  &__added-token {
    padding: 2px 4px;
    background-color: transparent;
    font-weight: bolder;
    letter-spacing: 0.05rem;
    border: 2px dashed green;
    margin: 0 3px;
    font-size: 12px;
  }
}

.side-menu {
  &__label {
    text-align: left;
    width: 100%;
    display: block;
    margin-top: 10px;
  }
  &__input {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
  }
}

.tokens {
  display: flex;
  align-items: center;

  &__list {
    list-style: none;
    padding-inline-start: 10px;
  }

  &__item {
    display: inline-block;
    padding: 5px;
    background-color: green;
    margin-right: 10px;
    color: aliceblue;
  }
}

button.btn {
  background-color: cornflowerblue;
  color: white;
	border-radius: 2px;
	border: 1px solid rgb(122, 159, 230);
	cursor: pointer;
  margin-right: 10px;
	font-size: 0.8rem;
	letter-spacing: 0.05rem;
	padding: 0.6rem 1rem;
	transition: transform 80ms ease-in;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
  box-shadow: none;
  box-sizing: border-box;

  &_size_l {
    padding: 0.6rem;
    white-space: unset;
    letter-spacing: 0.1rem;
  }

  &_theme_calm {
    background-color: rgb(80, 80, 80);
    color: white;
    border-radius: 2px;
    border: 1px solid rgb(161, 161, 161);
  }

  &:active:not(:disabled) {
		transform: scale(0.95);
	}
	&:focus:not(:disabled) {
		outline: none;
	}
}
</style>
