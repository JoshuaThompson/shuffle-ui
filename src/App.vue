<template>
  <div id="app">
    <header>
      <h1>Twitch Shuffle</h1>
      <p>I'm feelin' lucky for Twitch.tv</p>
      <p class="credits">Built by <a href="https://github.com/JoshuaThompson/shuffle-ui" target="_blank">Joshua Thompson</a> using <a href="https://dev.twitch.tv/">Twitch.tv API</a></p>
    </header>
    <section id="main-container" class="row">
      <div id="filters" class="col-lg-4 col-xs-12">
        <div class="row">
          <div class="col-xs-12 filter">
            <ui-textbox label="Minimum Viewers" type="number" placeholder="Streams with over X viewers" v-model="minViewers"></ui-textbox>
          </div>
          <div class="col-xs-12 filter">
            <ui-textbox label="Maximum Viewers" type="number" placeholder="Streams with under Y viewers" v-model="maxViewers"></ui-textbox>
          </div>
          <div class="col-xs-12 filter">
            <ui-select label="Languages" placeholder="Select languages to filter by" :options="languageOptions" v-model="selectedLanguages" :multiple="languageSelectMultiple"></ui-select>
          </div>
          <div class="col-xs-12 filter">
            <ui-checkbox label="Hide Partnered Streams?" v-model="hidePartner"></ui-checkbox>
          </div>
          <div class="col-xs-12 filter">
            <ui-checkbox label="Hide Mature Streams?" v-model="hideMature"></ui-checkbox>
          </div>
          <div class="col-xs-12 filter">
            <ui-button type="primary" color="primary" buttonType="button" icon="shuffle" v-on:click="shuffle" :loading="debounceShuffle" :disabled="debounceShuffle">Shuffle</ui-button>
          </div>
        </div>
      </div>
      <div id="streams" class="col-lg-8 col-xs-12">
        <div :id="stream.stream_id" class="stream" v-if="stream !== null">
          <iframe 
            :src="'https://player.twitch.tv/?autoplay=true&channel=' + stream.channel.name"
            width="400"
            height="300"
            frameborder="0" 
            scrolling="no"
            allowfullscreen="true">
          </iframe>
        </div>
        <div v-if="stream === null && !errorFindingStream" class="no-stream-message">
          <h2>Searching for a stream...</h2>
        </div>
        <div v-if="stream === null && errorFindingStream" class="no-stream-message">
          <h2>No stream matches your criteria.</h2>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

const twitch_core = axios.create({
  baseURL: process.env.API_HOST,
  timeout: 30000
});

export default {
  name: 'app',
  data() {
    return {
      minViewers: 50,
      maxViewers: 750,
      selectedLanguages: [{ label: 'English', value: 'en' }],
      languageOptions: [
        { label: 'English', value: 'en' },
        { label: 'Dansk', value: 'da' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' },
        { label: 'Italiano', value: 'it' },
        { label: 'Magyar', value: 'hu' },
        { label: 'Nederlands', value: 'nl' },
        { label: 'Norsk', value: 'no' },
        { label: 'Polski', value: 'pl' },
        { label: 'Português', value: 'pt' },
        { label: 'Slovenčina', value: 'sk' },
        { label: 'Suomi', value: 'fi' },
        { label: 'Svenska', value: 'sv' },
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'Türkçe', value: 'tr' },
        { label: 'Čeština', value: 'cs' },
        { label: 'Ελληνικά', value: 'el' },
        { label: 'Български', value: 'bg' },
        { label: 'Русский', value: 'ru' },
        { label: 'العربية', value: 'ar' },
        { label: 'ภาษาไทย', value: 'th' },
        { label: '中文', value: 'zh' },
        { label: '日本語', value: 'ja' },
        { label: '한국어', value: 'ko' },
        { label: 'American Sign Language', value: 'asl' },
        { label: 'Other', value: 'other' }
      ],
      languageSelectMultiple: true,
      hidePartner: false,
      hideMature: true,
      stream: null,
      debounceShuffle: true,
      errorFindingStream: false
    }
  },
  mounted() {
    this.shuffle();
  },
  methods: {
    shuffle() {
      this.$data.errorFindingStream = false;
      this.$data.debounceShuffle = true;
      twitch_core.post('/random_stream', {
                    languages: (this.$data.selectedLanguages.length > 0) ? this.$data.selectedLanguages.map((language) => { return language.value }) : null,
                    hide_partner: (this.$data.hidePartner) ? this.$data.hidePartner : null,
                    hide_mature: (this.$data.hideMature) ? this.$data.hideMature : null,
                    min_viewers: this.$data.minViewers,
                    max_viewers: this.$data.maxViewers
                  })
                  .then((stream) => {

                    if (stream.data[0] === undefined) {
                      this.$data.stream = null;
                      errorFindingStream = true;
                    } else {
                      this.$data.stream = stream.data[0];
                    }
                    
                    setTimeout(() => {
                      this.$data.debounceShuffle = false;
                    }, 500);
                  })
                  .catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                      this.$data.stream = null;
                      this.$data.errorFindingStream = true;
                      this.$data.debounceShuffle = false;
                    }, 500);
                  });
    }
  }
}
</script>

<style lang="scss">

*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    font-size: 100%;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    color: #242729;
}

body {
  margin: 0;
}

@import '~flexboxgrid/dist/flexboxgrid.css';
@import '~keen-ui/dist/keen-ui.css';
@import url(https://fonts.googleapis.com/css?family=Raleway:800|Open+Sans:400);
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

h1 {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 4rem;
  font-weight: 800;
}

header {
  padding: 3rem;
  background-color: #6441A4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    text-align: center;
    margin: 0;
    color: #FFFFFF;
  }

  p {
    font-size: 1.4rem;
    font-weight: 400;
    color: #FFFFFF;
    margin: 0;
  }

  p.credits {
    font-size: .7rem;
    color: #FFFFFF;

    a {
      color: #FFFFFF;
      text-decoration: underline;
    }

    a:hover {
      color: #FFFFFF;
    }
  }
}

#main-container {
  margin: 2%;

  #filters {
    padding: 2em 3em;

    button {
      width: 100%;
    }

    .filter {
      margin-top: 3%;
    }
  }

  #streams {
    .stream {
      position:relative;
      padding-bottom:56.25%;
      height:0;
    }

    .stream iframe{
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      border:0;
    }

    .no-stream-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom:56.25%;
      height:0;
    }
  }
}

/* Overwriting styles until keen-ui has easier color editing  */
.ui-button--type-primary.ui-button--color-primary {
  background-color: #6441A4;
}

.ui-button--type-primary.ui-button--color-primary:hover:not(.is-disabled), .ui-button--type-primary.ui-button--color-primary.has-dropdown-open, .ui-button--type-primary.ui-button--color-primary.has-focus-ring:focus, body[modality="keyboard"] .ui-button--type-primary.ui-button--color-primary:focus {
  background-color: #6441A4;
}

.ui-checkbox--color-primary.is-checked .ui-checkbox__checkmark::before {
  background-color: #6441A4;
  border-color: #6441A4;
}

.ui-checkbox--color-primary:not(.is-disabled).is-checked:hover .ui-checkbox__checkmark::before, .ui-checkbox--color-primary:not(.is-disabled).is-checked.is-active .ui-checkbox__checkmark::before {
  background-color: #6441A4;
  border-color: #6441A4;
}

.ui-textbox.is-active:not(.is-disabled) .ui-textbox__label-text, .ui-textbox.is-active:not(.is-disabled) .ui-textbox__icon-wrapper .ui-icon {
  color: #6441A4;
}

.ui-textbox.is-active:not(.is-disabled) .ui-textbox__input, .ui-textbox.is-active:not(.is-disabled) .ui-textbox__textarea {
  border-bottom: 2px solid #6441A4;
}

.ui-select.is-active:not(.is-disabled) .ui-select__label-text, .ui-select.is-active:not(.is-disabled) .ui-select__icon-wrapper .ui-icon {
  color: #6441A4;
}

.ui-select.is-active:not(.is-disabled) .ui-select__display {
  border-bottom: 2px solid #6441A4;
}

.ui-select-option.is-selected {
  color: #6441A4;
}

.ui-select-option.is-selected .ui-select-option__checkbox {
  color:#6441A4;
}


</style>
