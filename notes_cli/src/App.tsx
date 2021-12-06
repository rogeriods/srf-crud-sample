import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { Note } from './models/note';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const App = () => {
  let emptyNote: Note = { id: 0, noteDescription: '' };

  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note>(emptyNote);
  const [noteDialog, setNoteDialog] = useState(false);
  const [deleteNoteDialog, setDeleteNoteDialog] = useState(false);
  const [deleteNotesDialog, setDeleteNotesDialog] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable>(null);

  // Fill my list of notes
  const fetchNotes = async () => {
    const { data } = await axios.get('notes');
    setNotes(data);
  };

  // Load function when starts the page
  useEffect(() => {
    fetchNotes();
  }, []);

  const openNew = () => {
    setNote(emptyNote);
    setSubmitted(false);
    setNoteDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setNoteDialog(false);
  };

  const hideDeleteNoteDialog = () => {
    setDeleteNoteDialog(false);
  };

  const hideDeleteNotesDialog = () => {
    setDeleteNotesDialog(false);
  };

  const saveNote = async () => {
    setSubmitted(true);

    if (note.noteDescription?.trim()) {
      let _notes = [...notes];
      let _note = { ...note };
      if (note.id) {
        // Update api
        await axios.put(`notes/${note.id}`, note);

        // Update grid
        const index = findIndexById(note.id);
        _notes[index] = _note;
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Note Updated', life: 3000 });
      } else {
        // Create api
        await axios.post('notes', note);

        // Create grid
        _notes.push(_note);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Note Created', life: 3000 });
      }

      setNotes(_notes);
      setNoteDialog(false);
      setNote(emptyNote);
    }
  };

  const editNote = (note: Note) => {
    setNote({ ...note });
    setNoteDialog(true);
  };

  const confirmDeleteNote = (note: Note) => {
    setNote(note);
    setDeleteNoteDialog(true);
  };

  const deleteNote = async () => {
    // Delete from api
    await axios.delete(`notes/${note.id}`);

    // Update grid
    let _notes = notes.filter((val) => val.id !== note.id);
    setNotes(_notes);
    setDeleteNoteDialog(false);
    setNote(emptyNote);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Note Deleted', life: 3000 });
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current?.exportCSV({ selectionOnly: false });
  };

  const confirmDeleteSelected = () => {
    setDeleteNotesDialog(true);
  };

  const deleteSelectedNotes = () => {
    // Delete api
    selectedNotes.map(async (val) => {
      await axios.delete(`notes/${val.id}`);
    });

    // Delete grid
    let _notes = notes.filter((val) => !selectedNotes.includes(val));
    setNotes(_notes);
    setDeleteNotesDialog(false);
    setSelectedNotes([]);
    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Notes Deleted', life: 3000 });
  };

  const actionBodyTemplate = (rowData: Note) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editNote(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDeleteNote(rowData)}
        />
      </React.Fragment>
    );
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = (e.target && e.target.value) || '';
    let _note: Note = { ...note };
    _note.noteDescription = val;

    setNote(_note);
  };

  const header = (
    <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: FormEvent<HTMLInputElement>) => setGlobalFilter(e.currentTarget.value)}
          placeholder="Search..."
          className="w-full lg:w-auto"
        />
      </span>
      <div className="mt-3 md:mt-0 flex justify-content-end">
        <Button
          icon="pi pi-plus"
          className="mr-2 p-button-rounded"
          onClick={openNew}
          tooltip="New"
          tooltipOptions={{ position: 'bottom' }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger mr-2 p-button-rounded"
          onClick={confirmDeleteSelected}
          disabled={!selectedNotes || !selectedNotes.length}
          tooltip="Delete"
          tooltipOptions={{ position: 'bottom' }}
        />
        <Button
          icon="pi pi-upload"
          className="p-button-help p-button-rounded"
          onClick={exportCSV}
          tooltip="Export"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    </div>
  );

  const noteDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveNote} />
    </React.Fragment>
  );

  const deleteNoteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteNoteDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteNote} />
    </React.Fragment>
  );

  const deleteNotesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteNotesDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedNotes} />
    </React.Fragment>
  );

  return (
    <div>
      <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
        <Toast ref={toast} />
        <div className="text-3xl text-800 font-bold mb-4">Notes CRUD</div>

        <DataTable
          ref={dt}
          value={notes}
          selection={selectedNotes}
          onSelectionChange={(e) => setSelectedNotes(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notes"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
          <Column field="id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="noteDescription" header="Description"></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>

        <Dialog
          visible={noteDialog}
          breakpoints={{ '960px': '75vw', '640px': '100vw' }}
          style={{ width: '40vw' }}
          header="Note Details"
          modal
          className="p-fluid"
          footer={noteDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="idNote">ID</label>
            <InputText
              id="idNote"
              value={note.id}
              disabled
              className={classNames({ 'p-invalid': submitted && !note.id })}
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description *</label>
            <InputTextarea
              id="description"
              value={note.noteDescription}
              onChange={(e) => onDescriptionChange(e)}
              required
              autoFocus
              rows={3}
              cols={20}
            />
            {submitted && !note.noteDescription && <small className="p-error">Note description is required.</small>}
          </div>
        </Dialog>

        <Dialog
          visible={deleteNoteDialog}
          style={{ width: '450px' }}
          header="Confirm"
          modal
          footer={deleteNoteDialogFooter}
          onHide={hideDeleteNoteDialog}
        >
          <div className="flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {note && (
              <span>
                Are you sure you want to delete ID: <b>{note.id}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteNotesDialog}
          style={{ width: '450px' }}
          header="Confirm"
          modal
          footer={deleteNotesDialogFooter}
          onHide={hideDeleteNotesDialog}
        >
          <div className="flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {note && <span>Are you sure you want to delete the selected notes?</span>}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default App;
