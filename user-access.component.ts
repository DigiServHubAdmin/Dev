import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {
  userForm: FormGroup;
  
  // Available accounts for dropdown
  availableAccounts: string[] = [
    'Account A',
    'Account B', 
    'Account C',
    'Account D',
    'Account E'
  ];
  
  statusOptions: string[] = ['Active', 'Inactive', 'Pending'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      isSuperUser: [false],
      isAccountManagementLead: [false],
      accountsSupported: this.fb.array([]),
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to changes on isAccountManagementLead
    this.userForm.get('isAccountManagementLead')?.valueChanges.subscribe(isLead => {
      if (!isLead) {
        this.clearAccountsSupported();
      }
    });
  }

  // Getter for accountsSupported FormArray
  get accountsSupported(): FormArray {
    return this.userForm.get('accountsSupported') as FormArray;
  }

  // Add new account dropdown
  addAccount(): void {
    const accountGroup = this.fb.group({
      accountName: ['', Validators.required]
    });
    this.accountsSupported.push(accountGroup);
  }

  // Remove account at specific index
  removeAccount(index: number): void {
    this.accountsSupported.removeAt(index);
  }

  // Clear all accounts
  clearAccountsSupported(): void {
    while (this.accountsSupported.length) {
      this.accountsSupported.removeAt(0);
    }
  }

  // Submit form
  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      console.log('Form Data:', formData);
      // Process your form data here
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}