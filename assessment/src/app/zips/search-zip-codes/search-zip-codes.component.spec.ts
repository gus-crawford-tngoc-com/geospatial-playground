import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchZipCodesComponent } from './search-zip-codes.component';
import { ZipsModule } from '../zips.module';
import { HttpClient } from '@angular/common/http';
// import { SearchZipsService } from '../search-zips.service';

import { MockHttpforZipCodes, mockZipCodeResults, mockZipCodes } from '../search-zips.service.spec';
import { throwError } from 'rxjs';

describe('SearchZipCodesComponent', () => {
  let component: SearchZipCodesComponent;
  let fixture: ComponentFixture<SearchZipCodesComponent>;
  let mockHttpClient: HttpClient;
  beforeEach(async () => {
    mockHttpClient = new MockHttpforZipCodes(mockZipCodeResults()) as any;
    await TestBed.configureTestingModule({
      imports:[ ZipsModule ],
      providers: [
        {
          provide: HttpClient,
          useValue: mockHttpClient
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchZipCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', ()=>{

    it('calls filterResults appropriately', async ()=>{
      spyOn(mockHttpClient, 'get').and.callThrough();
      spyOn(component.zipSearch, 'filterResults').and.callThrough();
      await component.search("xyz");
      expect(mockHttpClient.get).toHaveBeenCalled();
      expect(component.zipSearch.filterResults).toHaveBeenCalledWith(mockZipCodes(), "xyz", undefined as any);
    });

    it('does not call filterResults appropriately', async ()=>{
      spyOn(mockHttpClient, 'get').and.callFake(()=>throwError("something went awry"));
      spyOn(component.zipSearch, 'filterResults');
      spyOn(component, 'search').and.callThrough();
      await component.search("xyz");
      // expect(async ()=> component.search("xyz") ).toThrowError(Error);
      expect(component.zipSearch.filterResults).not.toHaveBeenCalled();
    });

  });
});