import { Component, ComponentInterface, h, Host, Prop, Listen, State } from '@stencil/core';
import { parseCsv } from '../../utils/parse-csv';
import { Flashcard } from './types';

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

    const target: any = event.target;

    const focus: any = target.shadowRoot.activeElement;

    if(event.code === 'Enter') {
      this.flipCard();
    }

    if(event.code === 'Space' && focus.classList.contains('cardset-wrapper')) {
      this.flipCard();
    }

  }

  @Prop() file: string;

  @Prop() json: Flashcard[] = [];

  @Prop() shuffle: boolean = true;

  @State() cardNumber: number = 0;

  @State() data: Flashcard[] = [];

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

      fileData = await parseCsv(file);

    } else if (extension === 'json') {

      fileData = await file.json();

    }

    this.data = [...this.json, ...fileData];

  }

  async initialize() {

    if (this.file && !this.json.length) {
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

      <Host>

        { this.data.length === 0 &&

          <p>
            <strong>Error</strong>: data missing or not formatted properly. You can use the "data" attribute to pass JSON data into the component or use the "file" attribute to point to a local csv or json file.
          </p>

        }

        <div class={{'is-hidden': this.data.length === 0}}>

          <div class="cardset-wrapper" tabindex="0">

            {/* Card */}

            {this.data.map((card, i) => (

              <div class={{
                'cardset': true,
                'flip': this.flipped,
                'is-block': this.showCard(i)
              }}>

                {/* Front */}

                <div class="card front" onClick={() => this.flipCard()}>

                  <div class={{
                    'card-contents': true, 
                    'disable-centering': card.front.disableCentering
                  }}>

                    { card.front.imageUrl &&
                      <img src={card.front.imageUrl} alt={card.front.alt} />
                    }

                    { card.front.text &&
                      <p>
                        <strong>{card.front.text}</strong>
                      </p>
                    }

                    { card.front.html &&
                      <div innerHTML={card.front.html}></div>
                    }

                  </div>

                </div>

                {/* Back */}

                <div class="card back" onClick={() => this.flipCard()}>

                  <div class={{
                    'card-contents': true,
                    'disable-centering': card.back.disableCentering
                  }}>

                    { card.back.imageUrl &&
                      <img src={card.back.imageUrl} alt={card.back.alt} />
                    }

                    { card.back.text &&
                      <p>
                        <strong>{card.back.text}</strong>
                      </p>
                    }

                    { card.back.html &&
                      <div innerHTML={card.back.html}></div>
                    }

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Next/Prev Controls */}

          <div class={{'is-hidden': this.data.length === 0, 'flashcard-controls': true}}>

            <p>
              {this.cardNumber + 1} of {this.data.length}
            </p>

            <button 
              class="button is-link mx-1"
              aria-label="Previous" 
              onClick={() => this.changeCard('prev')} 
              disabled={this.firstCard()}>

              <span class="arrow" aria-hidden="true">&lsaquo;</span><span class="is-sr-only">Previous</span>

            </button>

            <button 
              class="button is-link mx-1"
              aria-label="Next" 
              onClick={() => this.changeCard('next')} 
              disabled={this.lastCard()}>

              <span class="is-sr-only">Next</span><span class="arrow" aria-hidden="true">&rsaquo;</span>

            </button>

          </div>
        
        </div>

      </Host>

    );

  }

}