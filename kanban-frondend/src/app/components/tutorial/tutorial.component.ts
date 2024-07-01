import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})

export class TutorialComponent {
  currentStep = 0;
  steps = [
    { title: 'Schritt 1', content: 'Hier wird erklärt, was im ersten Schritt zu tun ist.' },
    { title: 'Schritt 2', content: 'Hier wird erklärt, was im zweiten Schritt zu tun ist.' },
    // Weitere Schritte hier definieren
  ];

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      // Tutorial beenden oder zurücksetzen, je nach Bedarf
      this.closeTutorial();
    }
  }

  closeTutorial() {
    // Logik, um das Tutorial zu schließen, z.B. Flag setzen oder EventEmitter auslösen
  }
}