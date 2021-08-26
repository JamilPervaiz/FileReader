import { Component, OnInit } from '@angular/core';
import datastorage from '../_files/datastorage.json';
import { FileData } from '../../models/file-data';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  files: FileData[] = [];
  public addFileForm: FormGroup;
  isEditing = false;
  fileEditing = {};

  createFormConrtols() {
    this.addFileForm = this.fb.group({
      'title' : ["", [Validators.required]],
      'url' :  ["", [Validators.required]],
      'approved' : [""],
    });   
  }

  get title() { return this.addFileForm.get('title') }
  get url() { return this.addFileForm.get('url') }
  get approved() { return this.addFileForm.get('approved') }

  constructor(public fb: FormBuilder,
      private dataService: DataService,
      private toastr: ToastrService) { }

  ngOnInit(): void {
    this.get();
    this.createFormConrtols()
  }

  get() {
    this.dataService.get()
    .subscribe((data) => {
      this.files = data;
    }, this.httpException)    
  }

  httpException = error => {
    console.log(error);
    this.toastr.error(error,"Error");
  }

  put(fileData: FileData) {
    alert("Data Saved Successfully");
    this.dataService.put(fileData) 
    .subscribe((response) => {
      alert("Data Saved Successfully");
    }, this.httpException)  ;  
  }

  addEvent() {
    var obj: FileData = {
      title: this.title.value,
      url: this.title.value,
      approved: this.approved.value
    }

    if (this.isEditing) {
      this.files.splice(this.files.indexOf(this.fileEditing), 1);

      this.isEditing = false;
      this.fileEditing = {};
    }

    this.files.push(obj);
    this.clearForm();

    this.toastr.error("Data Saved Successfully","Success");
  }

  editData(index: number, file: FileData) {
    this.setForm(file);
  }

  setForm(file: FileData) {
    this.title.setValue(file.title);
    this.url.setValue(file.url);
    this.approved.setValue(file.approved);

    this.isEditing = true;
    this.fileEditing = file;
  }

  clearForm() {
    this.title.setValue("");
    this.url.setValue("");
    this.approved.setValue("");
  }

  delete(index: number, file: FileData) {
    this.files.splice(this.files.indexOf(file), 1);
    this.toastr.error("File Deleted Successfully","Success");
  }
}
