<template>
  <div id="app">
    <div class="editor">
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
              v-model="currentUser.name"
            >
            <label for="email" class="side-menu__label">Адрес e-mail</label>
            <input id="email" 
              class="side-menu__input" 
              type="text"
              v-model="currentUser.email"
            >
            <label for="phone" class="side-menu__label">Контактный телефон</label>
            <input id="phone" 
              class="side-menu__input" 
              type="text"
              v-model="currentUser.phone"
            >
            <label for="site" class="side-menu__label">Основной веб-сайт</label>
            <input id="site" 
              class="side-menu__input" 
              type="text"
              v-model="currentUser.site"
            >
          </fieldset>
        </div>
      </div>
      <div class="editor__letter-configurator">
        <div class="tokens">
          <span class="tokens__text">Вставить токен: </span>
          <ul class="tokens__list">
            <li class="tokens__item"
              :class="{
                'tokens__item_disabled': !currentUser[token.id],
              }"
              v-for="token in tokens"
              :key="token.id"
              @click="clickToken(token.id)"
            >{{token.name}}</li>
          </ul>
        </div>
        <div class="editor__letter-area">
          <div class="editor__letter" 
            ref="letter"
            contenteditable="true"
            @click="clickLetterArea()"
            @keyup="letterChanged($event)"
            >
            <div class="editor__letter-fragment" 
              v-for="(dataItem, ndx) in dataForLetter"
              :key=ndx
            >
              <p class="editor__text-p" v-if="dataItem.textP">{{dataItem.textP}}</p>
              <addedToken
                v-if="dataItem.tokenId"
                :textToken="currentUser[dataItem.tokenId] || dataItem.textAddedToken"
                :tokenId="`${dataItem.tokenid}`"
              ></addedToken>
            </div>
          </div>
        </div>        
        <div class="editor__btns">
          <button class="btn"
            @click="loadFromLocalstorage"
          >Загрузить из localStorage</button>
          <button class="btn"
            @click="saveToLocalstorage"
          >Сохранить в localStorage</button>
        </div>
        <div class="editor__template">
          <div class="editor__ready-letter" 
            contenteditable="true" 
            readonly
          >{{transformReadyLetter}}</div>
        </div>

      <pre>{{dataForLetter}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import all_users from '../src/users.json'
import {randomInteger} from './pure'

import addedToken from './components/addedToken.vue'

export default {
  name: 'App',
  components: {
    addedToken,
  },
  data() {
    return {
      users: all_users,
      currentUser: {
        name: '',
        email: '',
        phone: '',
        site: '',
      },
      tokens: [
        { id: 'name', name: 'имя' },
        { id: 'email', name: 'почта' },
        { id: 'phone', name: 'телефон' },
        { id: 'site', name: 'сайт' },
      ],
      selectionLetter: {
        start: 0,
        end: 0,
        html: '',
        allNodes: NodeList,
        anchorNode: ''
      },
      dataForLetter: [
        {
          textP: 'Hello darkness, my old',
          textAddedToken: 'friend',
          tokenId: 'name',
        },
        {
          textP: `I've come to talk with you `,
          textAddedToken: 'again',
          tokenId: 'site',
        },
        {
          textP: `, Because a vision`,
          textAddedToken: '',
          tokenId: '',
        },
      ],
    }
  },
  computed: {
    letter() {
      return this.$refs['letter'];
    },
    transformReadyLetter() {
      return this.dataForLetter.reduce((readyText, item) => {
        const textToken = item.textAddedToken ? `[[[${item.textAddedToken}]]]` : '';
        const textP = item.textP;
        return readyText + textP + textToken + '';
      }, '');
    },

  },
  methods: {
    loadUser() {
      const usersAmount = this.users.length;
      const userRandomNumber = randomInteger(usersAmount);
      this.currentUser = this.users[userRandomNumber];
    },
    clickToken(tokenId) {
      if (!this.currentUser[tokenId]) return;

      const nodeWhereCursor = this.selectionLetter.anchorNode.parentNode;
      let ndxNodeWhereInsert = 0;

      this.selectionLetter.allNodes.forEach((noda, ndx) => {
        const textPNoda = noda.querySelector('.editor__text-p');

          if (nodeWhereCursor === textPNoda) {
            const newTextPLeft = textPNoda.textContent.substring(0, this.selectionLetter.start) || ' ';
            const newTextPRight = textPNoda.textContent.substring(this.selectionLetter.end);
            ndxNodeWhereInsert = ndx;

            this.dataForLetter[ndxNodeWhereInsert].textP = newTextPRight;
            this.dataForLetter.splice(ndxNodeWhereInsert, 0,
              {
                textP: newTextPLeft,
                textAddedToken: this.currentUser[tokenId],
                tokenId: tokenId
              });
          }
        
      });

      //ставим курсор после добавленной ноды
      this.$nextTick(() => {
        this.selection.removeAllRanges();
        let range = new Range();
        range.selectNode(this.letter.childNodes[ndxNodeWhereInsert].querySelector('.added-token'));
        range.collapse(false);
        this.selection.addRange(range);

        this.updateSelectionLetter();
      });
    }, 
    clickLetterArea() {
      this.updateSelectionLetter();
    },
    letterChanged(event) {
      if (!event.returnValue) return;
      this.updateSelectionLetter();
    },
    updateSelectionLetter() {
      this.selectionLetter.start = this.selection.anchorOffset;
      this.selectionLetter.end = this.selection.focusOffset;
      this.selectionLetter.anchorNode = this.selection.anchorNode;
      this.selectionLetter.allNodes = Array.from(this.letter.childNodes);
      this.selectionLetter.html = this.$refs.letter.innerHTML;
      this.selectionLetter.outerhtml = this.$refs.letter.outerHTML;
    },
    // updateReadyLetterText() {
    //   const readyLetterNodes = Array.from(this.letter.childNodes).map(node => {
    //     const textPNoda = node.querySelector('.editor__text-p');
    //     const addedToken = node.querySelector('.added-token');
    //     let renewNode = '';
    //     if (textPNoda) {
    //       renewNode += textPNoda.textContent;
    //     }
    //     if (addedToken) {
    //       renewNode += `[[[${addedToken.textContent.trim()}]]]`;
    //     }
    //     return renewNode;
    //   });
    //   console.log('readyLetterNodes = ',readyLetterNodes);
    //   this.readyLetter.text = readyLetterNodes.join('');
    // },
    updateLetterText() {
      
      // let newLetterText = this.readyLetter.text;
      //   newLetterText = newLetterText.replace( /\[\[\[/g, '<span data-token="true" class="editor__added-token" contenteditable="false">' );
      //   newLetterText = newLetterText.replace( /\]\]\]/g, '</span>' );
      // this.letter.innerHTML = newLetterText;
    },
    saveToLocalstorage() {
      localStorage.setItem("letter", JSON.stringify(this.dataForLetter));
    },
    loadFromLocalstorage() {
      this.dataForLetter = JSON.parse(localStorage.getItem("letter"));
      this.updateLetterText();
    },
  },
  watch: {
  },
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
  &__letter-fragment {
    display: inline-flex;
    align-items: baseline;
  }
  &__text-p {
    display: inline-block;
    padding: 0;
    margin: 0;
    white-space: pre;
  }
  &__tokens {
    display: flex;
  }
  &__btns {
    padding: 10px 0;
    text-align: left;
  }
  &__added-token {
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
    margin-right: 10px;
    background-color: green;
    color: aliceblue;
    cursor: pointer;

    &_disabled {
      background-color: gray;
      color: white;
      cursor: unset;
    }
  }
}

button.btn {
  background-color: cornflowerblue;
  color: white;
	border-radius: 2px;
	border: 1px solid rgb(122, 159, 230);
	cursor: pointer;
  margin-right: 10px;
  margin-left: 0;
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
