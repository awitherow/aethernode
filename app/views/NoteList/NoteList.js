import React, { Component, PropTypes } from 'react';
import * as noteService from './servants/notes';

import TextInput from '../../elements/TextInput';
import CheckboxInput from '../../elements/CheckboxInput';

import Note from './components/note';
import Editor from '../Editor';

export default class NoteList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noteInput: "",
      priority: false,
      notes: [],
      editor: {
        hidden: true,
        note: {},
      },
    };
  }

  componentDidMount() {
    this.getNotes();
  }

  getNotes() {
    this.context.update('loading', true);
    noteService.get(notes => {
      this.setState({ notes });
      this.context.update('loading', false);
    });
  }

  removeNote(id) {
    this.context.update('loading', true);
    noteService.remove(id, () => this.getNotes());
  }

  addNote(e) {
    e.preventDefault();
    const { noteInput, priority } = this.state;
    noteService.add({
      content: noteInput,
      prio: priority,
    }, () => this.getNotes());
    this.setState({ noteInput: "", priority: false });
  }

  editNote(id) {
    const { notes } = this.state;
    let note = notes.filter(note => note.id === id)[0];
    if (!note) return;
    this.setState({
      editor: {
        hidden: false,
        note,
      },
    });
  }

  submitEdit(edits) {
    noteService.update(this.state.editor.note, edits, () => this.closeEditor())
  }

  closeEditor(){
    this.setState({
      editor: {
        hidden: true,
        note: {},
      },
    });
  }

  render() {
    const { editor, notes, noteInput, priority } = this.state;

    return (
      <div className="main">

      <Editor
        type="note"
        hidden={editor.hidden}
        note={editor.note}
        onSubmit={this.submitEdit.bind(this)}
        onClose={this.closeEditor.bind(this)}
        />

        <h2>notes <span>({notes.length})</span></h2>
        <ul className="notes-list">
          {notes.map(note =>
            <Note
              key={note.id}
              note={note}
              removeNote={this.removeNote.bind(this)}
              editNote={this.editNote.bind(this)}
              />
          )}
        </ul>
        <form className="add-note" onSubmit={this.addNote.bind(this)}>
          <TextInput
            id="note"
            label="Awaiting changes..."
            defaultValue={noteInput}
            onChange={(e) => this.setState({ noteInput: e.target.value })}
            />
          <CheckboxInput
            id="priority"
            label="Important task?"
            defaultChecked={priority}
            onClick={(e) => {
              this.setState({ priority: e.target.checked });
            }}
            />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

NoteList.contextTypes = {
  update: PropTypes.func.isRequired,
};
