


class jianghuAreas
{
    NofPoints;
    points;
    voronoi;
    areaGroups;
    

    constructor(NofPoints,width,height) {
        this.NofPoints = NofPoints;
        this.points = [];
        for (let i = 0; i < NofPoints; i++) {
            this.points.push([random(width), random(height)]);
        }

        // 使用Delaunay算法计算三角剖分
        const delaunay = d3.Delaunay.from(this.points);

        // 使用Delaunay三角剖分来获取Voronoi图
        this.voronoi = delaunay.voronoi([0, 0, width, height]);
        this.areaGroups = [];

        
      }

      createArea(name,centerX,centerY,R,color)
        {
            // 创建一个数组来存储Sprite对象
            let areaGroup = new Group();
            //areaGroup.name = name;
            areaGroup.strokeWeight = 0.15;
            areaGroup.stroke='white';
            areaGroup.overlaps(allSprites);
            areaGroup.name = name;
            areaGroup.center = null;
            //areaGroup.color = color;
            //areaGroup.textSize = 40;
            
            
            let nearestDist = 999999;
            //let nearestSprite = null;
            //let vs = [];


            // 遍历每个Voronoi区域，并创建Sprite对象
            for (let i = 0; i < this.NofPoints; i++) {

                const centerDist = dist(this.points[i][0],this.points[i][1],centerX, centerY);

                if (centerDist < R)
                    {
                        const cell = this.voronoi.cellPolygon(i);
                        const vertices = cell.map(vertex => {
                            return [vertex[0], vertex[1]];
                          });
                        vertices.push(vertices[0]);
                        //console.log(vertices);
                        let p = new areaGroup.Sprite(vertices);
                        p.overlaps(player,()=>{color = 'red'});
                        
                        if (centerDist<nearestDist) {nearestDist = centerDist; areaGroup.center = p;}
                        //vs.push(vertices);
                    }
            }
            //const mergedPolygon = polygonClipping.union(vs);
            //console.log(mergedPolygon);
            
            
            if (areaGroup.center) 
                {
                    //console.log('ok');
                    areaGroup.center.text = name;
                    areaGroup.center.textSize = 30;
                    areaGroup.color = color;
                }
            this.areaGroups.push(areaGroup);

        }




}




