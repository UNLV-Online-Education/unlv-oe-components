import { Component, h, Listen, Prop, State } from '@stencil/core';

import Sortable from 'sortablejs';

import { DragDropItem } from './types';
import { parseCsv } from '../../utils/parse-csv';

@Component({
  tag: 'unlv-oe-drag-drop',
  styleUrl: 'drag-drop.scss',
  shadow: false,
})
export class UnlvOeDragDrop {

  @Listen('keydown')
  keyboardInput(event: KeyboardEvent) {

    if(event.code === 'Enter') {

      const focusedElement = document.activeElement;

      if (
        // Grab draggable
        !this.selectedElement &&
        focusedElement.classList.contains('draggable')
      ) {

        this.pickup(focusedElement, focusedElement.parentNode);

      } else if (
        // Drop draggable
        focusedElement.classList.contains('drop-list') ||
        focusedElement.classList.contains('drag-list')
      ) {

        this.drop(this.selectedElement, focusedElement);

      }

    }

  }

  @Prop() data: DragDropItem[] = [];

  @Prop() file: string;

  @State() dragTabIndex: number = 0;

  @State() dragListTabIndex: number = -1;

  @State() dropListTabIndex: number = 0;

  @State() graded: boolean = false;

  correct: number = 0;

  selectedElement: HTMLElement;

  sortableJsDrags: any;

  sortableJsDrops: any[] = [];

  total: number = 0;

  componentWillLoad() {
    this.initialize();
  }

  componentDidLoad() {
    this.createDraggables();
  }

  componentDidUpdate() {
    this.createDroppables();
  }

  checkAnswers() {

    for (let [i, item] of this.data.entries()) {

      if (item.category === 'drag') {

        this.total++;

        const drop: any = this.sortableJsDrops.filter(obj => { return obj.id === item.id })[0];

        const children = drop.sortable.el.children;

        for (let child of children) {

          const dataIndex = parseInt(child.dataset.index);

          if (dataIndex === i) {

            this.correct++;

          }

        }

      }

    }

    this.disableAll();

    this.graded = true;

  }
  
  containsObject(obj, list): any {

    let i;

    for (i = 0; i < list.length; i++) {

      if (list[i] === obj) {
        return true;
      }

    }

    return false;

  }

  createDraggables() {

    const draggables = document.getElementById('draggables');

    this.sortableJsDrags = Sortable.create(draggables, {
      group: 'shared',
      animation: 150
    });

    for(let drag of this.sortableJsDrags.el.children) {
      drag.dataset.id = drag.id;
    }

  }

  createDroppables() {

    for (let drop of this.sortableJsDrops) {

      const droppables = document.getElementById(drop.id);
  
      drop.sortable = Sortable.create(droppables, {
        group: 'shared',
        animation: 150
      });

    }

  }

  createDropList() {

    for (let item of this.data) {

      if (
        item.category === 'drop' && 
        !this.containsObject(item, this.sortableJsDrops)
      ) {
        this.sortableJsDrops = [...this.sortableJsDrops, item];
      }
      
    }

  }

  disableAll() {
    
    this.sortableJsDrags.destroy();

    console.log(this.sortableJsDrags);

    for (let drop of this.sortableJsDrops) {

      console.log(drop.sortable);
  
      drop.sortable.destroy();

    }

    // this.render();

  }
  
  drop(item, parent) {

    // append selected draggable to focused drop list
    parent.appendChild(item);

    // revert tabindexes
    this.dragTabIndex = 0;
    this.dragListTabIndex = -1;

    // clear selected element
    delete this.selectedElement;

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

    this.data = [...this.data, ...fileData];

  }

  async initialize() {

    if (this.file && !this.data.length) {
      await this.getFileData();
    }

    this.createDropList();

  }

  pickup(item, parent) {

    // save focused element
    this.selectedElement = item;

    // cut element from DOM drag list
    parent.removeChild(item);

    // change tabindexes so that only lists are selectable
    this.dragTabIndex = -1;
    this.dragListTabIndex = 0;

    // move focus to first drop list
    const firstDropId = document.getElementsByClassName('drop-list')[0].id;
    const firstDrop = document.getElementById(firstDropId);
    firstDrop.focus();

  }

  retry() {
    location.reload();
  }

  render() {

    const draggables = this.data.map((item, index) => {

      if (item.category === 'drag') {

        return (
          <li class="zone draggable" draggable={true} tabindex={this.dragTabIndex} data-index={index}>
            <img class={{'hide': item.imageUrl === null}} src={item.imageUrl} alt={item.alt} />
            <p class={{'hide': item.text === null}}>{item.text}</p>
          </li>
        );

      }

    });

    const droppables = this.sortableJsDrops.map((item) => {

      if (item.category === 'drop') {

        return (
          <div class="zone drop-group">

            <div class="header">
              <h2>{item.text}</h2>
              <img src={item.imageUrl} alt={item.alt} />
            </div>

            <ul id={item.id} class="drop-list" tabindex={this.dropListTabIndex}></ul>

          </div>
        );

      }

    });

    return (

      <div class="container">

        <div class="columns">

          <div class="column">

            <ul id="draggables" class="drag-list" tabindex={this.dragListTabIndex}>

              {draggables}

            </ul>

          </div>

          <div class="column">

            {droppables}

          </div>

        </div>

        <footer>

          <p class={{'hide': this.graded}}>
            <button class="button" onClick={() => this.checkAnswers()} tabindex="0">Check</button>
          </p>

          <p class={{'hide': !this.graded, 'complete': true}}>
            <progress class="progress is-success" value={this.correct} max={this.total}></progress>
            <span class="score">{this.correct}/{this.total}</span>
            <button class="button" onClick={() => this.retry()} tabindex="0">Retry</button>
          </p>

        </footer>

      </div>

    );

  }

}
