import { Component, ComponentInterface, Host, h, Prop, State } from '@stencil/core';
import * as braintree from '@braintree/sanitize-url';

@Component({
  tag: 'unlv-oe-feedback-button',
  styleUrl: 'feedback-button.scss',
  shadow: true,
})
export class FeedbackButton implements ComponentInterface {

  @State() survey: boolean = false;

  @Prop() src: string;

  validateSrc(newValue: any) {

    if (!newValue) { 
      this.error = true;
      this.errorMessage = 'You must have a valid src URL in order for the feedback button to work.'
      throw new Error('src: is required');
    };

  }

  @Prop() buttonCss: object;

  @Prop() buttonText: string = 'Was this helpful?';

  error: boolean = false;

  errorMessage: string = '';

  defaultButtonCss: object = {
    animation: 'swing',
    animationDuration: '0.5s',
    position: 'fixed',
    fontWeight: 'bold',
    top: '1rem', 
    right:'1rem', 
    bottom: 'auto',
    left: 'auto',
    color: 'rgba(0,0,0,.7)',
    backgroundColor: '#ffdd57',
    borderColor: 'transparent',
    zIndex: 9
  }

  completeButtonCss: any = {...this.defaultButtonCss, ...this.buttonCss};

  componentWillLoad() {
    this.validateSrc(this.src);
  }

  toggleSurvey() {
    this.survey = !this.survey;
  }

  sanitize(url: string) {
    return braintree.sanitizeUrl(url);
  }

  render() {

    return (

      <Host>

        <div class={{'hide': !this.error}}>
          <p>
            {this.errorMessage}
          </p>
        </div>

        <div class={{'hide': this.error}}>

          <div class={{'is-active': this.survey, 'modal': true}} tabindex="0">

            <div class="modal-background"></div>

            <div class="modal-content">

              <iframe src={this.sanitize(this.src)}></iframe>

            </div>

            <button class="modal-close is-large" aria-label="close" onClick={() => this.toggleSurvey()}></button>

          </div>

          <button class="button" style={this.completeButtonCss} onClick={() => this.toggleSurvey()}>{this.buttonText}</button>

        </div>

      </Host>
      
    );

  }

}
