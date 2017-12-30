<template>
    <canvas ref="barChart" width="800" height="800" style="marginLeft: 100px"></canvas>
</template>
<script>
import { animate } from '../utils.js'

export default {
	data() {
        return {
            data: [ [2163,250], [2143,250], [2140,250], [2014,968], [1961,250] ],
            barW: [],
            bars: {
                barH: 20,
                gap: 40,
                color: [ 'blue', 'gold' ] // 右前 左後
            },

        }
    },
    methods: {
        drawBar: function( y, x1, x2 ){
            let cc = this.$refs.barChart
            let ctx = cc.getContext("2d")

            // let datumR = 500
            // let datumL = 300

            // bottom bar
            ctx.fillStyle = this.bars.color[0]
            ctx.fillRect( 0, y, x1, this.bars.barH)
            // (起始X,起始Y,長度,高度 )

            // top bar
            ctx.fillStyle = this.bars.color[1]
            ctx.fillRect( 0, y, x2, this.bars.barH)
            // (起始X,起始Y,長度,高度 )

        },
        // drawBar: function( y){
        // // animate version
        //     let cc = this.$refs.barChart
        //     let ctx = cc.getContext("2d")

        //     animate({
        //         duration: 1000,
        //         timing: function(timeFraction) {
        //             return Math.pow(timeFraction, 5);
        //         },
        //         draw: function(progress) {
        //             let datumR = 500 * progress
        //             let datumL = 300 * progress

        //             ctx.fillStyle = this.bars.color[0]
        //             ctx.fillRect( 0, y, datumR, this.bars.barH)
        //             // (起始X,起始Y,長度,高度 )

        //             ctx.fillStyle = this.bars.color[1]
        //             ctx.fillRect( 0, y, datumL, this.bars.barH)
        //             // (起始X,起始Y,長度,高度 )

        //         }
        //     })
        // }
        getBarW: function(data){
            let barWArr = []
            let cc = this.$refs.barChart
            let Nx1 = data[0][0]
            let Nx2 = data[0][1]

            // Canvas 寬
            let offsetX = ( cc.currentStyle || document.defaultView.getComputedStyle(cc,'') ).width
            offsetX = Number( offsetX.replace('px','') )

            console.log(data)
            console.log(Nx1)
            console.log(Nx2)

            data.map( item =>{
                barWArr.push( [ item[0] / Nx1 * offsetX , item[1] / Nx1 * offsetX ] )
            })

            return barWArr

        },
        assemble: function(data){
            data.map( ( val, n) =>{
                this.drawBar( (n * 40), val[0], val[1] )
            })
        }

    },
    mounted(){
        this.barW = this.getBarW( this.data )
        this.assemble( this.barW )
    }

}
</script>
<style>
</style>
