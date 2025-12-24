import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  private apiUrl = 'http://localhost:5000/api/ExportExcel/ExportToExcel';

  constructor(private http: HttpClient) { }

  // Method to export table data to Excel
  exportToExcel(tableName: string): Observable<Blob> {
    const params = new HttpParams().set('tableName', tableName);  // Table name ko parameters mein bhejna

    return this.http.get(this.apiUrl, {
      params: params,
      responseType: 'blob'  // Response ko blob format mein chahiye
    });
  }
}
