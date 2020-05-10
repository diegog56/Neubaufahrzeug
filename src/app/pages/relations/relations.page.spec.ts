import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelationsPage } from './relations.page';

describe('RelationsPage', () => {
  let component: RelationsPage;
  let fixture: ComponentFixture<RelationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
