import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private prikaziInfo: boolean = false;
  private prikaziPravila: boolean = false;
  private pridruzivanjeSobi: boolean = true;
  private pravljenjeNoveSobe: boolean = true;
  constructor(private chatService: ChatService) {
    
  }

  ngOnInit(): void {
  }

  get getPravljenjeNoveSobe(): boolean {
    return this.pravljenjeNoveSobe;
  }

  get getPrikaziPravila(): boolean {
    return this.prikaziPravila;
  }
  get getPrikaziInfo(): boolean {
    return this.prikaziInfo;
  }

  get getPridruzivanjeSobi(): boolean {
    return this.pridruzivanjeSobi;
  }

  public onPrikaziInfo(): void {
    this.prikaziInfo = !this.prikaziInfo;
  }
  public onPrikaziPravila(): void {
    this.prikaziPravila = !this.prikaziPravila;
  }


  public onPridruzivanjeSobi(): void {
    this.pridruzivanjeSobi = !this.pridruzivanjeSobi;
    this.pravljenjeNoveSobe = true;
  }

  public onPravljenjeNoveSobe(): void {
    this.pravljenjeNoveSobe = !this.pravljenjeNoveSobe;
    this.pridruzivanjeSobi = true;
  }



  // Metod za komunikaciju sa chat servisom. Postavlja username naseg korisnika.
  // I u zavisnosti da li je popunio polje za pridruzivanje ili za kreiranje 
  // nove sobe chat servis vrsi neophodne operacije.
  public onUnosImena(username: string, roomCode: string, roomName: string) {
    this.chatService.setUsername(username);
    if (roomCode !== '') {
      this.chatService.joinToRoom(roomCode);
    } else if (roomName !== '') {
      this.chatService.createNewRoomRequest(roomName);
    }

  }
}