import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = `${environment.apiBaseUrl}/api/WorkFlowTab`;

  constructor(private http: HttpClient) {}

  getTabs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tabs`);
  }

  // Har tab ka data alag API se
  getWorkflowData(pf: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/GetData`, {
    params: { pf: pf }
  });
}
getWorkflowDetail(wfId: string) {
  return this.http.get(`/api/workflow/detail/${wfId}`);
}
getJLov(
  P_V1: string = '', 
  P_V2: string = '', 
  P_V3: string = '', 
  P_V4: string = '', 
  P_ACTION: string
): Observable<any> {
  let params = new HttpParams()
    .set('P_V1', P_V1)
    .set('P_V2', P_V2)
    .set('P_V3', P_V3)
    .set('P_V4', P_V4)
    .set('P_ACTION', P_ACTION)
    .set('p_getdata', '');

  return this.http.get(`${this.apiUrl}/JLov`, { params });
}
getAction(): Observable<any> {
    return this.http.get(`${this.apiUrl}/JAction`);
  }
  saveWorkflow(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Save`, payload);
  }
}
