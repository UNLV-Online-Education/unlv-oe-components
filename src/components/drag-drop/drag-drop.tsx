import { Component, h, Listen, Prop, State } from '@stencil/core';
import Sortable from 'sortablejs';
import { parseCsv } from '../../utils/parse-csv';
import { DragDropItem } from './types';

@Component({
  tag: 'unlv-oe-drag-drop',
  styleUrl: 'drag-drop.scss',
  shadow: false,
})
export class UnlvOeDragDrop {

  @Listen('keydown')
  keyboardInput(event: KeyboardEvent) {

    if(event.code === 'ArrowDown' || event.code === 'ArrowUp') {

      const focusedElement = document.activeElement;

      if (focusedElement.classList.contains('dropdown-toggle') && event.code === 'ArrowDown') {
        
        const dropdownGroup = focusedElement.parentElement;

        // open dropdown menu
        if (!dropdownGroup.classList.contains('is-active')) dropdownGroup.classList.add('is-active');

        // focus first menu item
        const firstMenuItem = (dropdownGroup.querySelector('.dropdown-menu ul > li:first-of-type button') as HTMLElement);

        firstMenuItem.focus();

      } else if (focusedElement.classList.contains('dropdown-item')) {

        if (event.code === 'ArrowDown') {

          // if there is a next button, focus...
          const nextElement = focusedElement.parentElement.nextElementSibling;

          if (nextElement) {

            const nextElementButton = (nextElement.querySelector('button') as HTMLElement);

            nextElementButton.focus();
          } else {

            // ... else focus the first button

            const firstMenuItemButton = (focusedElement.parentElement.parentElement.querySelector('li:first-of-type > button') as HTMLElement);

            firstMenuItemButton.focus();

          }

        } else if (event.code === 'ArrowUp') {

          // if there is a previous button, focus...
          const previousElement = focusedElement.parentElement.previousElementSibling;

          if (previousElement) {

            const previousElementButton = (previousElement.querySelector('button') as HTMLElement);

            previousElementButton.focus();

          
          } else {

            // ... else focus the last button

            const lastMenuItemButton = (focusedElement.parentElement.parentElement.querySelector('li:last-of-type > button') as HTMLElement);

            lastMenuItemButton.focus();

          }

        }

      }

    }

  }

  @Prop() json: DragDropItem[] = [];

  @Prop() file: string;

  @State() data: DragDropItem[] = [];

  @State() graded: boolean = false;

  correct: number = 0;

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

        const drop: any = this.sortableJsDrops.filter(obj => { 
          return obj.id === item.id 
        })[0];

        const children = drop.sortable.el.children;

        for (let child of children) {

          const dataIndex: number = parseInt(child.dataset.index);

          const drag = document.querySelector(`[data-index="${dataIndex}"]`);

          if (dataIndex === i) {

            this.correct++;

            const correct = 'has-background-success-light';

            drag.classList.add(correct);

            drag.querySelector('.dropdown > button').classList.add('correct');

          }

        }

      }

    }

    this.disableAllDraggables();

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

  disableAllDraggables() {
    
    this.sortableJsDrags.destroy();

    for (let drop of this.sortableJsDrops) {
  
      drop.sortable.destroy();

    }

  }

  // // to be used on draggables onDragStart event
  // dragstartHandler(event, index) {
  //   const element = document.querySelector(`[data-index="${index}"]`);
  //   event.dataTransfer.setDragImage(element, 0, 0);
  //   console.log(event, element);
  // }

  dropDownItemSelect(dragIndex, dropId) {
    const drop = document.getElementById(`${dropId}`);
    const drag = document.querySelector(`[data-index="${dragIndex}"]`);
    drop.appendChild(drag);
    this.dropDownToggle(dragIndex);
  }

  dropDownGetItems(dragIndex) {

    let menuItems = [];

    this.data.map((item) => {

      if (item.category === 'drop') {
  
        menuItems.push(<li><button role="menuitem" class="button is-ghost dropdown-item" onClick={() => this.dropDownItemSelect(dragIndex, item.id)}>{item.title}</button></li>)
  
      }
  
    });

    return menuItems;   

  }

  dropDownToggle(index) {

    const dropdown = document.querySelector(`[data-index="${index}"] > .dropdown`);

    if (dropdown.classList.contains('is-active')) {

      dropdown.classList.remove('is-active');

    } else {

      dropdown.classList.add('is-active');

    }

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

    this.createDropList();

  }

  retry() {
    location.reload();
  }

  render() {

    const draggables = this.data.map((item, index) => {

      if (item.category === 'drag') {

        return (
          <li class="draggable has-background-light" draggable={true} data-index={index}>

            { item.title &&
              <p class="title">{item.title}</p>
            }

            { item.imageUrl &&
              <img class={{'hide': item.imageUrl === null}} src={item.imageUrl} alt={item.alt} />
            }

            { item.text && 
              <p>{item.text}</p>
            }

            <div class="dropdown">

              <button class="button is-small dropdown-toggle" aria-haspopup="true" onClick={() => this.dropDownToggle(index)}>
                <span aria-hidden="true">&#10021;</span>
                <span class="is-sr-only">Move {item.title} { item.alt }</span>
              </button>

              <div class="dropdown-menu">
                <ul class="dropdown-content" role="menu">
                  {this.dropDownGetItems(index)}
                </ul>
              </div>

            </div>

          </li>
        );

      }

    });

    const droppables = this.sortableJsDrops.map((item) => {

      if (item.category === 'drop') {

        return (
          <div class="drop-group">

            <div class="header">
              { item.title &&
                <h1>{item.title}</h1>
              }
              { item.imageUrl &&
                <img src={item.imageUrl} alt={item.alt} />
              }
            </div>

            <ul id={item.id} class="drop-list">
            </ul>

          </div>
        );

      }

    });

    return (

      <div class="unlv-oe-drag-drop">

        <div class="columns p-4">

          <div class="column is-two-fifths">

            <ul id="draggables" class="drag-list m-0">

              {draggables}

            </ul>

          </div>

          <div class="column is-three-fifths">

            {droppables}

          </div>

        </div>

        <footer class="p-4">

        { !this.graded &&
          <p>
            <button role="button" aria-label="Check" class="button is-link" onClick={() => this.checkAnswers()}>Check</button>
          </p>
        }

        { this.graded &&

          <p>
            <progress class="progress is-success mb-0 mr-4" value={this.correct} max={this.total}></progress>
            <span class="score">{this.correct}/{this.total}</span>
            <button role="button" aria-label="Retry" class="button is-link" onClick={() => this.retry()}>Retry</button>
          </p>

        }

        </footer>

      </div>

    );

  }

}