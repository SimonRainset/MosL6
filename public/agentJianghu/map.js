

  class JianghuMap {
    width;
    height;
    n;
    tileLines;
    
    constructor(width=20,height=20,n=20) {
      this.width = width;
      this.height = height;
      this.n = n;
      this.tileLines = this.generateTiles(width,height,n);
     


    }


  

    generateTiles(w,h,n) {
        const tiles = [];
        const totalChars = w * h;
        const equalSigns = n;
      
        // Generate a string with 20 equal signs
        const equalString = '='.repeat(equalSigns);
      
        // Fill the tiles array with random characters, replacing 20 of them with equal signs
        for (let i = 0; i < totalChars; i++) {
          if (i < equalSigns) {
            tiles.push('=');
          } else {
            tiles.push(' '); // Use space instead of '.'
          }
        }
      
        // Shuffle the tiles array to randomize the positions of the equal signs
        for (let i = tiles.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
      
        // Convert the tiles array into a 20x20 grid
        const tilesGrid = [];
        for (let i = 0; i < h; i++) {
          tilesGrid.push(tiles.slice(i * w, (i + 1) * w).join(''));
        }
      
        return tilesGrid;
      }
  }
  