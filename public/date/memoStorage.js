class NewMemo{
  content = "";
  embedding = [];
  mood = '';
  importance = 0;
  constructor() {
    this.content = "";
    this.embedding = [];
    this.mood = [];
    this.importance = 0; 
  }

  assignMood(stringPosition){
    this.mood = stringPosition.split(',').map(Number);
  }
}