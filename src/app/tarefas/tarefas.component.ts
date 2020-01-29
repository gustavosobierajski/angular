import { Component, OnInit } from '@angular/core';
	
import { Tarefa } from './models/tarefa.model';
import {HttpClient} from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css']
})
export class TarefasComponent implements OnInit {

  readonly apiURL : string;
  tarefas: Tarefa[];

  constructor(private http : HttpClient, private location: Location ) {
    this.apiURL = 'https://enigmatic-everglades-10053.herokuapp.com/tarefa';
  }

  ngOnInit() {
    this.listarTodasTarefas();
  }

  listarTodasTarefas() {
    this.http.get<Tarefa[]>(`${ this.apiURL }/tarefa`)
            .subscribe(resultado => this.tarefas = resultado);
  }

  adicionarTarefa(newTitulo : string, newDescricao : string) {
    var t = new Tarefa();
    t.titulo = newTitulo;
    t.descricao = newDescricao;
    t.fl_Status = true;
    t.dt_criacao = new Date;
        
    this.http.post<Tarefa[]>(`${ this.apiURL }/tarefa`, t)
              .subscribe(
                resultado => {
                  console.log(resultado)
                },
                erro => {
                  if(erro.status == 400) {
                    console.log(erro);
                  }
                }
              );
              location.reload();
  }

  concluirTarefa(t: Tarefa) {
      this.http.put<Tarefa[]>(`${ this.apiURL }/tarefa/${t.id}`, t)
                .subscribe(
                  resultado => {
                    console.log('Tarefa alterada com sucesso.')
                  },
                  erro => {
                    switch(erro.status) {
                      case 400:
                        console.log(erro.error.mensagem);
                        break;
                      case 404: 
                        console.log('Tarefa não localizada.');
                        break;
                    }
                  }
                );

  }

  excluirTarefa(id: number) { 
    this.http.delete<Tarefa[]>(`${ this.apiURL }/tarefa/${id}`)
              .subscribe(
                resultado => {
                  console.log('Tarefa excluída com sucesso.');
                },
                erro => {
                  if(erro.status == 404) {
                    console.log('Tarefa não localizada.');
                  }
                }
              );

  }

}
