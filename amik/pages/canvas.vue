<template>
  <v-container>
    <div ref="printMe">
      <ve-histogram :data="chartData"></ve-histogram>
    </div>
    <v-btn @click="print">a</v-btn>
    
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      output: null,
      chartData: {
          columns: ['date', 'cost', 'profit', 'growthRate', 'people'],
          rows: [
            { 'cost': 1523, 'date': '01/01', 'profit': 1523, 'growthRate': 0.12, 'people': 100 },
            { 'cost': 1223, 'date': '01/02', 'profit': 1523, 'growthRate': 0.345, 'people': 100 },
            { 'cost': 2123, 'date': '01/03', 'profit': 1523, 'growthRate': 0.7, 'people': 100 },
            { 'cost': 4123, 'date': '01/04', 'profit': 1523, 'growthRate': 0.31, 'people': 100 }
          ]
        }
    }
  },

  methods: {
    async print() {
      const el = this.$refs.printMe
      const options = {
        type: 'dataURL',        
      }
      this.output = await this.$html2canvas(el, options)
      this.generatePdf()
    },
    generatePdf() {
      var pdfMake = require('pdfmake/build/pdfmake.js')
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs
      }      
      
      var docDefinition = {
        content: [
          {
            image: this.output,            
          },          
        ],
        pageSize: 'A3',
        pageOrientation: 'landscape'
      }

      pdfMake.createPdf(docDefinition).open()
    }
  }
}
</script>