            <div class="col-md-4 align-self-center">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="IsIndustryLead" formControlName="IsIndustryLead">
                    <label class="form-check-label" for="IsIndustryLead">Is Industry Lead</label>
                </div>
                <div class="small font-weight-bold text-muted mt-2" *ngIf="profilesForm.value.IsIndustryLead">
                    <div class="form-floating">
                        <select class="form-select" id="IndustriesSupported" aria-label="Floating label select example" #IndustriesSupportedValue (change)="addTagValue('IndustriesSupported',IndustriesSupportedValue.value)">
                          <option selected>Open this select menu</option>
                          <option *ngFor=" let Items of common.dd.Industry" value="{{Items.value}}">{{Items.value}}</option>
                        </select>
                        <label for="IndustriesSupported">IndustriesSupported</label>
                    </div>
                    <div class="border p-1 my-1 bg-light" *ngIf="varGroup.IndustriesSupported?.length>0">
                        <div class="pb-1" *ngFor="let Items of varGroup.IndustriesSupported">
                            <span>{{Items.value}} <span class="badge text-bg-danger" (click)="deleteTag('IndustriesSupported',Items)" role="button">&times;</span></span>
                        </div>
                    </div>
                </div>
            </div>