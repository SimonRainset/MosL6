function draw() {
  clear();
  drawGui();

  time1.w -= 0.1;
  time1.x = time2.x - time2.w / 2 + time1.w / 2;

  if (button.isPressed) {
    pet.image = './dog2.jpg';
    pet.image.scale = 1.2;
    isClick = true;
  }

  if (isClick) {
    if (foodnum == 0) {
      food = new Sprite();
      food.image = './food.jpg';
      food.scale = 0.15;
      foodnum++;
    }

    food.x = mouse.x;
    food.y = mouse.y;
  }

  if (food instanceof Sprite && Math.abs(food.x - pet.x) < 10 && Math.abs(food.y - pet.y) < 10) {
    pet.image = './dog.jpg';
    food.remove();
    if (isClick) {
      like1.w = Math.min(like1.w + 90, 200);
      like1.x = like2.x - like2.w / 2 + like1.w / 2;

      if (hunger1 instanceof Sprite) {
        hunger1.w = Math.min(hunger1.w + 90, 200);
        hunger1.x = hunger2.x - hunger2.w / 2 + hunger1.w / 2;
        foodnum--;
      }
    }
    isClick = false;
  }


}
