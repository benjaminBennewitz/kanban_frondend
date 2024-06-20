import { Injectable } from '@angular/core';

interface Mascot {
  id: number;
  text: string;
}

@Injectable({
  providedIn: 'root',
})

export class MascotComponent {

  private mascotTexts: Mascot[] = [
    { id: 1, text: 'Don\'t forget, you have {{todoCount}} tasks in todo' },
    { id: 2, text: 'Meow! You still need to do {{todoCount}} tasks!' },
    { id: 3, text: 'Purrfect! You have {{inProgressCount}} tasks in progress.' },
    { id: 4, text: 'You\'re doing great! Only {{allTasksLeft}} tasks left to complete.' },
    { id: 5, text: 'My name is Carly, and I love helping you with your tasks!' },
    { id: 6, text: 'Let\'s focus on the {{urgentCount}} urgent tasks first!' },
    { id: 7, text: 'Remember to take breaks while working on {{inProgressCount}} tasks.' },
    { id: 8, text: 'Keep going! You can finish those {{todoCount}} todos!' },
    { id: 9, text: 'I believe in you! Only {{allTasksLeft}} tasks left!' },
    { id: 10, text: 'Don\'t let the {{urgentCount}} tasks stress you out!' },
    { id: 11, text: 'I\'m here to remind you about your {{todoCount}} todos!' },
    { id: 12, text: 'Almost there! Just {{inProgressCount}} tasks still in progress!' },
    { id: 13, text: 'Well done! You\'ve completed {{doneCount}} tasks!' },
    { id: 14, text: 'Need some help? Focus on the {{urgentCount}} urgent tasks!' },
    { id: 15, text: 'I\'ll be here, watching you complete your {{todoCount}} todos!' },
    { id: 16, text: 'Stay pawsitive! {{inProgressCount}} tasks are in progress!' },
    { id: 17, text: 'Keep up the good work! Only {{todoCount}} todos left!' },
    { id: 18, text: 'You can do it! {{urgentCount}} urgent tasks are waiting!' },
    { id: 19, text: 'I love naps, but I\'ll help you with your tasks first!' },
    { id: 20, text: 'Great job! You have {{doneCount}} completed tasks!' },
  ];

  /**
   * get the texts from array and returns it to board.component
   * @param counts 
   * @returns 
   */
  getMascotTexts(counts: { [key: string]: number }): Mascot[] {
    return this.mascotTexts.map(textObj => {
      let newText = textObj.text;
      for (const [key, value] of Object.entries(counts)) {
        newText = newText.replace(`{{${key}}}`, value.toString());
      }
      return { ...textObj, text: newText };
    });
  }
}
