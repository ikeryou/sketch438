import { Color, Vector3 } from "three";
import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Tween } from "../core/tween";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _allStr: Array<string> = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
  // private _allStr: Array<string> = ['A']
  private _items: Array<HTMLElement> = []
  private _noise: Vector3 = new Vector3(0, 0, 0)
  private _useStr: string = ''
  // private _useBlankStr: string = ''
  private _isHover: boolean = false
  private _defCol: Array<Color> = []

  constructor(opt:any) {
    super(opt)

    this._c = opt.key * 1

    this._useStr = Util.randomArr(this._allStr)
    // this._useBlankStr = Util.randomArr(['', '_', ''])

    this._noise.x = Util.random(5, 10) * 0.5
    this._noise.y = Util.random2(1, 20)
    // this._noise.x = 5
    // this._noise.y = 0

    const colRand = Util.hit(2) ? 1 : Util.randomInt(2, 10)

    const line = Util.random(0.5, 1)
    let size = Func.val(Util.random(0.5, 1.5) * 10, Util.random(0.5, 1.5) * 5)
    // if(Util.hit(20)) size = 20

    const num = Func.val(8, 10)
    for (let i = 0; i < num; i++) {
      const div = document.createElement('div')
      div.classList.add('js-item-txt')
      this.el.appendChild(div)
      this._items.push(div)

      const peakCol = new Color(0,0,0)
      peakCol.offsetHSL(Util.random(0, 1), 1, 0.5)

      const fontCol = new Color(Util.hit(colRand) ? peakCol.getStyle() : 0xffffff)

      this._defCol.push(fontCol)

      div.style.color = fontCol.getStyle()
      div.style.lineHeight = line + ''
      div.style.fontSize = size + 'vw'

      div.innerHTML = Util.randomArr(this._allStr)

      this.useGPU(div)
    }

    this._setHover()
  }

  //
  protected _eRollOver() {
    this._isHover = true
  }


  //
  protected _eRollOut() {
    this._isHover = false
  }

  private _makeShadow(ang: number, color: Color, interval: number):string {
    let radius = 0;
    const num = Func.val(4, 5);

    let res = '';
    for(var i = 0; i <= num; i++) {
      const col = color.clone()
      col.offsetHSL(Util.map(i, 0, 0.2, 0, num), 0, Util.map(i, 0, 0.1, 0, num))
      let rad = Util.radian(ang)
      let x = ~~(Math.sin(rad * 1) * radius);
      let y = ~~(Math.cos(rad * 1) * radius);
      res += x + 'px ' + y + 'px 0px ' + col.getStyle();
      if(i != num) {
        res += ', ';
      }
      radius += interval;
    }

    return res;
  }

  protected _update():void {
    super._update();

    // const mx = MousePointer.instance.easeNormal.x

    this._items.forEach((el:HTMLElement, i:number) => {
      const rad = Util.radian(this._c * this._noise.x + i * this._noise.y)
      // const d = Util.map(Math.sin(rad), 1, this._items.length - 1, -1, 1)

      // const txtShadow = this._makeShadow(Math.sin(rad) * 180, this._defCol[i].clone().offsetHSL(Math.sin(rad), Math.cos(rad), Math.sin(rad * -0.4)), 10)
      const txtShadow = this._makeShadow(Math.sin(rad) * 180 * (i % 2 === 0 ? 1 : -1), (this._isHover ? this._defCol[i] : new Color(0xffffff)), Math.abs(Math.sin(rad) * 10))

      if(this._isHover) {
        // el.innerHTML = d >= i ? Util.randomArr(this._allStr) : this._useBlankStr

        const peakCol = new Color(0,0,0)
        peakCol.offsetHSL(Util.random(0, 1), 1, 0.5)
        Tween.set(el, {
          backgroundColor: peakCol.getStyle(),
          color: peakCol.getStyle(),
          lineHeight: Util.map(Math.cos(rad * 2), 0.25, 0.75, -1, 1),
          textShadow:txtShadow,
        })
      } else {
        // el.innerHTML = d >= i ? this._useStr : this._useBlankStr
        el.innerHTML = this._useStr
        Tween.set(el, {
          color: '#000',
          backgroundColor: '',
          lineHeight: Util.map(Math.cos(rad * 2), 0.25, 0.75, -1, 1),
          textShadow:txtShadow,
        })
      }



    })
  }
}







