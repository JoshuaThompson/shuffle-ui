<template>
  <div id="app">
    <header>
      <h1>Twitch Shuffle</h1>
      <p>Discover low-viewer streams</p>
    </header>
    <section id="filters">
      <div class="row">
        <div class="col-md-4 col-xs-12 filter">
          <ui-textbox label="Minimum Viewers" type="number" placeholder="Streams with over X viewers" v-model="minViewers"></ui-textbox>
        </div>
        <div class="col-md-4 col-xs-12 filter">
          <ui-textbox label="Maximum Viewers" type="number" placeholder="Streams with under Y viewers" v-model="maxViewers"></ui-textbox>
        </div>
        <div class="col-md-4 col-xs-12 filter">
          <ui-select label="Languages" placeholder="Select languages to filter by" :options="languageOptions" v-model="selectedLanguages" :multiple="languageSelectMultiple"></ui-select>
        </div>
        <div class="col-md-4 col-xs-12 filter">
          <ui-checkbox label="Hide Partnered Streams?" v-model="hidePartner"></ui-checkbox>
        </div>
        <div class="col-md-4 col-xs-12 filter">
          <ui-checkbox label="Hide Mature Streams?" v-model="hideMature"></ui-checkbox>
        </div>
        <div class="col-md-4 col-xs-12 filter">
          <ui-button type="primary" color="primary" buttonType="button" icon="shuffle" v-on:click="shuffle">Re-Shuffle</ui-button>
        </div>
      </div>
    </section>
    <section id="streams">
      <div class="row">
        <div v-for="stream in streams" :id="stream.stream_id" class="col-md-3 stream">
          <iframe 
            :src="'http://player.twitch.tv/?autoplay=false&channel=' + stream.channel.name"
            width="400"
            height="300"
            frameborder="0" 
            scrolling="no"
            allowfullscreen="true">
          </iframe>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

const twitch_core = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000
});

export default {
  name: 'app',
  data() {
    return {
      minViewers: 0,
      maxViewers: 1000,
      selectedLanguages: [],
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
      streams: []
    }
  },
  mounted() {
    this.shuffle();
  },
  methods: {
    shuffle() {
      twitch_core.post('/random_streams', {
                    languages: (this.$data.selectedLanguages.length > 0) ? this.$data.selectedLanguages.map((language) => { return language.value }) : null,
                    hide_partner: this.$data.hidePartner,
                    hide_mature: this.$data.hideMature,
                    min_viewers: this.$data.minViewers,
                    max_viewers: this.$data.maxViewers
                  })
                  .then((streams) => {
                    this.$data.streams = streams.data;
                  })
                  .catch((err) => {
                    console.log(err);
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
@import url(http://fonts.googleapis.com/css?family=Raleway:800|Open+Sans:400);
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

h1 {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  font-size: 4rem;
  font-weight: 800;
}

header {
  padding: 4rem;
  background-color: #6441A4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    text-align: center;
    margin-bottom: 0;
    color: #FFFFFF;
  }

  p {
    font-size: 1.4rem;
    font-weight: 400;
    color: #FFFFFF;
  }
}

#filters {
  margin: 0em 3em;
  padding: 2em 0em;
  border-bottom: 1px solid #242729;

  button {
    width: 100%;
  }

  .filter {
    margin-top: 3%;
  }
}

#streams {
  margin: 0em 3em;

  .stream {
    margin-top: 2em;
  }
}

</style>
