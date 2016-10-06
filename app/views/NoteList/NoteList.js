import './styles/note-list.scss'
import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import * as noteService from '../../api/notes'
import { statusTypes, contextTypes } from './config'

import FlexibleInput from '../../elements/FlexibleInput'
import CheckboxInput from '../../elements/CheckboxInput'
import Dropdown from '../../elements/Dropdown'

import NoteItem from './components/NoteItem'
import EditNote from './components/EditNote'

class NoteList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noteInput: "",
      priority: false,
      notes: [],
      editor: {
        hidden: true,
        note: {},
      },
      context: 'personal',
      status: 'now',
      activeNotes: 0,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getNotes()
  }

  getNotes() {
    this.context.update('loading', true)
    noteService.get(notes => {
      this.setState({ notes })
      this.context.update('loading', false)
    })
  }

  removeNote(id) {
    this.context.update('loading', true)
    noteService.remove(id, () => this.getNotes())
  }

  addNote(e) {
    e.preventDefault()
    const { noteInput, priority, context } = this.state
    noteService.add({
      content: noteInput,
      prio: priority,
      status: 'inbox',
      context,
    }, () => {
      this.setState({ noteInput: "", priority: false })
      this.getNotes()
    })
  }

  editNote(id) {
    const { notes } = this.state
    let note = notes.filter(note => note.id === id)[0]
    if (!note) return
    this.setState({
      editor: {
        hidden: false,
        note,
      },
    })
  }

  submitEdit(edits) {
    noteService.update(this.state.editor.note, edits, () => {
      this.closeEditor()
      this.getNotes()
    })
  }

  closeEditor(){
    this.setState({
      editor: {
        hidden: true,
        note: {},
      },
    })
  }

  filter(notes) {
    let filteredNotes = notes.filter(note => note.context === this.state.context)
    filteredNotes = filteredNotes.filter(note => note.status === this.state.status)
    if (this.state.activeNotes !== filteredNotes.length) {
      this.setState({ activeNotes: filteredNotes.length })
    }
    return filteredNotes
  }

  handleChange(whatToChange, change) {
    switch (whatToChange) {
      case 'status': this.setState({ status: change }); break
      case 'context': this.setState({ context: change }); break
      default: return
    }
  }

  render() {
    const { editor, notes, activeNotes } = this.state
    const noteListClasses = classnames('note-list', {
      'hidden': !editor.hidden,
    })

    return (
      <div className="note-page">

        <EditNote
          hidden={editor.hidden}
          note={editor.note}
          onSubmit={this.submitEdit.bind(this)}
          onClose={this.closeEditor.bind(this)}
          onRemove={this.removeNote.bind(this)}
          />

        <div className={noteListClasses}>
          <div className="sub-header">
            <h2 className="note-list__page-title">
              Notes <span>({activeNotes})</span>
            </h2>
            <button
              className="refresh-notes"
              onClick={this.getNotes.bind(this)}>
              &#8635;
            </button>
          </div>

          <div className="note-list__sort">
            <Dropdown
              id="context-types"
              label="Context"
              options={contextTypes}
              defaultValue={this.state.status}
              handleChange={e => this.handleChange('context', e.target.value)}
              />
            <Dropdown
              id="status-types"
              label="Status"
              options={statusTypes}
              defaultValue={this.state.status}
              handleChange={e => this.handleChange('status', e.target.value)}
              />
          </div>

          <ul className="note-list__list">
            {this.filter(notes).map(note =>
              <NoteItem
                key={note.id}
                note={note}
                removeNote={this.removeNote.bind(this)}
                editNote={this.editNote.bind(this)}
                />
            )}
          </ul>

          <form className="note-list__add-note" onSubmit={this.addNote.bind(this)}>
            <FlexibleInput
              id="note"
              label="Awaiting changes..."
              type="text"
              defaultValue=""
              onChange={(e) => this.setState({ noteInput: e.target.value })}
              />
            <CheckboxInput
              id="priority"
              label="Important task?"
              defaultChecked={false}
              onClick={(e) => {
                this.setState({ priority: e.target.checked })
              }}
              />
            <button>&#43;</button>
          </form>

        </div>
      </div>
    )
  }
}

NoteList.contextTypes = {
  update: PropTypes.func.isRequired,
}

export default NoteList
