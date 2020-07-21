import { Component, ComponentInterface, Host, h, Prop, Listen, State } from '@stencil/core';

import { Flashcard, StyleOptions } from './types';

import Papa from 'papaparse';

@Component({
  tag: 'unlv-oe-flashcards',
  styleUrl: 'flashcards.scss',
  shadow: true,
})
export class Flashcards implements ComponentInterface {

  @Listen('keydown')
  keyboardInput(event: KeyboardEvent) {

    if(event.code === 'ArrowRight') {
      this.changeCard('next');
    }

    if(event.code === 'ArrowLeft') {
      this.changeCard('prev');
    }

    if(event.code === 'Enter') {
      this.flipCard();
    }

  }

  @Prop() shuffle: boolean = true;

  @Prop() data: Flashcard[] = [];

  @Prop() file: string;

  @Prop() options: StyleOptions = {
    backgroundColor: 'hsl(0, 0%, 96%)',
    buttonBackgroundColor: 'hsl(171, 100%, 41%)',
    buttonColor: 'hsl(0, 0%, 100%)'
  }

  @State() cardNumber: number = 0;

  @State() flipped: boolean = false;

  componentWillLoad() {
    this.initialize();
  }

  changeCard(direction: string) {

    this.flipped = false;

    if (
      direction === 'next' &&
      this.cardNumber < this.data.length - 1
    ) {

      this.cardNumber++;

    } else if (
      direction === 'prev' &&
      this.cardNumber > 0
    ) {

      this.cardNumber--;

    }

  }

  async expand( obj ) {

    function parseDotNotation(str, val, obj) {

      let currentObj = obj,
          keys = str.split("."),
          i, l = Math.max(1, keys.length - 1),
          key;

      for (i = 0; i < l; ++i) {
          key = keys[i];
          currentObj[key] = currentObj[key] || {};
          currentObj = currentObj[key];
      }

      currentObj[keys[i]] = val;

      delete obj[str];

  }

    for (let key in obj) {
      parseDotNotation( key, obj[key], obj );
    }

    return obj;

  };

  firstCard() {

    if (this.cardNumber === 0) {
      return true;
    }

  }

  flipCard() {

    this.flipped = !this.flipped;

  }

  async getFileData() {

    const extension = this.file.split('.').pop();

    const file = await fetch(this.file);

    let fileData;

    if (extension === 'csv') {

      fileData = await this.parseCsv(file);

    } else if (extension === 'json') {

      fileData = await file.json();

    }

    this.data = [...this.data, ...fileData];

  }

  async initialize() {

    if (this.file && !this.data.length) {
      await this.getFileData();
    }

    if (this.data.length && this.shuffle) {
      this.shuffler(this.data);
    }

  }

  lastCard() {

    if (this.cardNumber === this.data.length - 1) {
      return true;
    }

  }

  async parseCsv(file) {

    const text = await file.text();
  
    const parsed = await Papa.parse(text, {
      header: true,
      dynamicTyping: true
    });

    for (let card of parsed.data) {

      card = await this.expand(card);

    }

    return parsed.data;    

  }

  showCard(index: number) {

    if (this.cardNumber === index) {
      return true;
    }

  }

  shuffler(arr: any) {

    for (let n = 0; n < arr.length - 1; n++) {

      const k = n + Math.floor(Math.random() * (arr.length - n));

      const temp = arr[k];

      arr[k] = arr[n];

      arr[n] = temp;

    }

    this.render();

  }

  render() {

    return (

      <Host style={{backgroundColor: this.options.backgroundColor}} tabindex="0">

        <div class={{'hide': this.data.length > 0}}>

          <p>
            <strong>Error</strong>: data missing or not formatted properly. You can use the "data" attribute to pass JSON data into the component or use the "file" attribute to point to a local csv or json file.
          </p>

        </div>

        <div class={{'hide': this.data.length === 0}}>

          <div class="cardset-wrapper">

            {/* Card */}

            {this.data.map((card, i) => (

              <div class={{
                'cardset': true,
                'flip': this.flipped,
                'show': this.showCard(i)
              }}>

                {/* Front */}

                <div class="card front" onClick={() => this.flipCard()}>

                  <div class={{
                    'card-contents': true, 
                    'disable-centering': card.front.disableCentering
                  }}>

                    <img class={{'hide': !card.front.imageUrl}} src={card.front.imageUrl} alt={card.front.alt} />

                    <p class={{'hide': !card.front.text}}>
                      <strong>{card.front.text}</strong>
                    </p>

                    <div class={{'hide': !card.front.html}} innerHTML={card.front.html}></div>

                  </div>

                </div>

                {/* Back */}

                <div class="card back" onClick={() => this.flipCard()}>

                  <div class={{
                    'card-contents': true,
                    'disable-centering': card.back.disableCentering
                  }}>

                    <img class={{'hide': !card.back.imageUrl}} src={card.back.imageUrl} alt={card.back.alt} />

                    <p class={{'hide': !card.back.text}}>
                      <strong>{card.back.text}</strong>
                    </p>

                    <div class={{'hide': !card.back.html}} innerHTML={card.back.html}></div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Next/Prev Controls */}

          <div class={{'hide': this.data.length === 0, 'flashcard-controls': true}}>

          <p>
            {this.cardNumber + 1} of {this.data.length}
          </p>

          <button 
            class="button"
            style={{
              backgroundColor: this.options.buttonBackgroundColor, 
              color: this.options.buttonColor
            }}
            aria-label="Previous" 
            onClick={() => this.changeCard('prev')} 
            disabled={this.firstCard()}>

            <span class="arrow" aria-hidden="true">&lsaquo;</span><span class="visually-hidden">Previous</span>

          </button>

          <button 
            class="button" 
            style={{
              backgroundColor: this.options.buttonBackgroundColor, 
              color: this.options.buttonColor
            }}
            aria-label="Next" 
            onClick={() => this.changeCard('next')} 
            disabled={this.lastCard()}>

            <span class="visually-hidden">Next</span><span class="arrow" aria-hidden="true">&rsaquo;</span>

          </button>

        </div>
        
        </div>

      </Host>

    );

  }

}