<template>
    <div class="raderChart_wrap">
        <canvas ref="raderChart" id="raderChart" width="400" height="300"></canvas>
        <div class="tooltip"

            :style=" tipsPosi "
            v-show="isShowTips" >
                {{ pentagon.subject[0] }} : No.{{ ranking[0] }}<br>
                {{ pentagon.subject[1] }} : No.{{ ranking[1] }}<br>
                {{ pentagon.subject[2] }} : No.{{ ranking[2] }}<br>
                {{ pentagon.subject[3] }} : No.{{ ranking[3] }}<br>
                {{ pentagon.subject[4] }} : No.{{ ranking[4] }}
        </div>
    </div>
    <!-- <svg width="500" height="500">
        <polygon class="pentagon" points="219,110 206,70 240,46 274,70 261,110 "/>
        <path d="M250,250 "/>
    </svg> -->
</template>
<script>
// :class="{ showTips : isShowTips }"

export default {
    props:[ "ranking", "sum" ],
	data() {
        return {
            pr: [],
            centerX: 0,
            centerY: 0,
            pentagon: {
                sides: 5,
                circumR: 100, // 五角形外接圓半徑
                degs: [54,126,198,270,342], // 五角形極座標角度
                sideColor: [ '#000', '#d3d3d3', '#d3d3d3', '#d3d3d3', '#d3d3d3'], // 座標線顏色 外->內
                subject: [ "人氣值", "狂粉值", "吸引力值", "親和力值", "舞台魅力值"]
            },
            isShowTips: false,
            tipsPosi: {
                top: '0px',
                left: '0px'
            }
        }
    },
    methods: {
        getPR: function(ranking, N){
            let prArr = []
            ranking.map( A => {
                prArr.push( ( N - A ) / N * 100 )
            })
            return prArr
        },
        getCenter: function(){
            let cc = this.$refs.raderChart

            let offsetX = (cc.currentStyle || document.defaultView.getComputedStyle(cc,'')).width
            offsetX = Number(offsetX.replace('px',''))
            this.centerX =  offsetX / 2

            let offsetY = (cc.currentStyle || document.defaultView.getComputedStyle(cc,'')).height
            offsetY = Number(offsetY.replace('px',''))
            this.centerY =  offsetY / 2
        },
        getCoordinate: function(dis){
            let points = []
            let disArr = typeof dis === 'object' ? dis : [ dis,dis,dis,dis,dis ]

            for (let i = 0; i < this.pentagon.sides; i++) {
                let deg = this.pentagon.degs[i]

                let x = Math.cos(deg * Math.PI / 180) * disArr[i]
                let y = Math.sin(deg * Math.PI / 180) * disArr[i]
                points[i] = { x: x, y: y }
            }

            return points
        },
        drawBg: function(){
            let cc = this.$refs.raderChart

            // 五角形 bg
            let degs = [54,126,198,270,342]
            let dis = []
            let length = this.pentagon.sides

            let diff =  this.pentagon.circumR / this.pentagon.sides
            for( let i = 0 ; i < this.pentagon.sides ; i++ ){
                dis.push( this.pentagon.circumR - i * diff )
            }

            let ctx = cc.getContext("2d")

            for( let a = 0 ; a < this.pentagon.sides ; a++ ){

                let points = this.getCoordinate(dis[a])

                ctx.strokeStyle = this.pentagon.sideColor[a]
                ctx.lineWidth = 1
                ctx.beginPath()

                ctx.moveTo(points[0].x + this.centerX, points[0].y + this.centerY)

                for (let i = 1; i < this.pentagon.sides; i++) {
                    ctx.lineTo(points[i].x + this.centerX, points[i].y + this.centerY)
                }
                ctx.lineTo(points[0].x + this.centerX, points[0].y + this.centerY)

                ctx.stroke()

                if( a == 0 ){
                    ctx.fillStyle="#fff"
                    ctx.fill()

                    // axial
                    let axial = cc.getContext("2d")
                    for (let i = 0; i < this.pentagon.sides; i++) {
                        axial.beginPath()
                        axial.moveTo( this.centerX, this.centerY)
                        axial.lineTo( points[i].x + this.centerX, points[i].y + this.centerY)
                        axial.strokeStyle = '#6699cc'
                        axial.stroke()
                    }
                }

            }

            // show txt
            let subpoints = this.getCoordinate( this.pentagon.circumR + diff)

            // 標題對期限 start
            // ctx.strokeStyle = "red" //線のカラー設定
            // ctx.lineWidth = 1 //線の太さ
            // ctx.beginPath() //パスの描画を始める

            // ctx.moveTo(subpoints[0].x + centerX, subpoints[0].y + centerY) //線の開始位置 (xの座標値 , yの座標値)

            // for (let i = 1; i < length; i++) { //配列がなくなるまで、線を引く処理を続ける
            //     ctx.lineTo(subpoints[i].x + centerX, subpoints[i].y + centerY) //配列から順番にx値とy値を取り出し、線を結ぶ
            // }
            // ctx.lineTo(subpoints[0].x + centerX, subpoints[0].y + centerY)

            // ctx.stroke() //線の終了
            // 標題對期限 end

            let ctxt = cc.getContext("2d")
            ctxt.fillStyle = "purple"
            ctxt.font = "16px Arial"
            ctxt.textAlign = "center"
            ctxt.textBaseline = "middle"
            for (let i = 0 ; i < this.pentagon.sides ; i++ ){
                ctxt.fillText( this.pentagon.subject[i], subpoints[i].x + this.centerX , subpoints[i].y + this.centerY )
            }
        },
        tipsHandle: function(pr){
            let cc = this.$refs.raderChart
            let ctx = cc.getContext("2d")
            let Datapoints = this.getCoordinate( pr )

            ctx.beginPath()

            ctx.moveTo( Datapoints[0].x + this.centerX, Datapoints[0].y + this.centerY )

            for ( let i = 1 ; i < this.pentagon.sides ; i++ ) {
                ctx.lineTo( Datapoints[i].x + this.centerX, Datapoints[i].y + this.centerY )
            }

            ctx.lineTo( Datapoints[0].x + this.centerX, Datapoints[0].y + this.centerY )

            let _this = this

            cc.addEventListener( 'mouseenter', function(){
                cc.addEventListener( 'mousemove', showT )
            })

            cc.addEventListener( 'mouseleave', function(){
                cc.removeEventListener( 'mousemove', showT )
                _this.isShowTips = false
            })

            function showT(e){
            // cc.onmousemove = function(e){

                // This gets the mouse coordinates (relative to the canvas)
                let mouseX  = e.offsetX
                let mouseY  = e.offsetY
                let deflect = 20
                let tipX = mouseX + deflect
                let tipY = mouseY + deflect

                // Replay the rectangle path (no need to fill() it) and test it
                if ( ctx.isPointInPath(mouseX, mouseY) ) {
                    _this.isShowTips = true

                    // let tipX = mouseX > _this.centerX ? (mouseX - 20) : (mouseX + 20)
                    // let tipY = mouseY > _this.centerY ? (mouseY - 20) : (mouseY + 20)

                    _this.tipsPosi.top = `${tipY}px`
                    _this.tipsPosi.left = `${tipX}px`

                    return
                }

                _this.isShowTips = false
            }
        },
        drawRadar: function(pr){
            let cc = this.$refs.raderChart
            let cta = cc.getContext("2d")

            let Datapoints = this.getCoordinate( pr )

            cta.strokeStyle = "#40bf9f"
            cta.lineWidth = 3
            cta.beginPath()

            cta.moveTo( Datapoints[0].x + this.centerX, Datapoints[0].y + this.centerY )

            for (let i = 1 ; i < this.pentagon.sides ; i++) {
                cta.lineTo(Datapoints[i].x + this.centerX, Datapoints[i].y + this.centerY)
            }

            cta.lineTo( Datapoints[0].x + this.centerX, Datapoints[0].y + this.centerY )

            cta.stroke()
            cta.fillStyle="rgba(102,204,178,0.5)"
            cta.fill()

            // points
            for (let i = 0 ; i < this.pentagon.sides ; i++) {
                cta.beginPath();
                cta.arc( Datapoints[i].x + this.centerX, Datapoints[i].y + this.centerY, 5, 0, 2 * Math.PI, true);
                cta.fillStyle="rgb(102,204,178)"
                cta.fill()
            }

        }
    },
    created(){
        // calculate PR value
        this.pr = this.getPR( this.ranking, this.sum )

    },
    mounted(){
        this.getCenter()
        this.drawBg()
        this.drawRadar( this.pr )
        // TODO: mobile device dosen't need hover effect
        this.tipsHandle( this.pr )

    }

}
</script>
<style>
</style>
