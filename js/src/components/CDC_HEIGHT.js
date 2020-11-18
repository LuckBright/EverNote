const dataSource = {
  measure: (_ => {
    let data = []
    for (let i = 0; i < 36; i++) {
      data.push({
        date: i + '',
        value: i
      })
    }
    return data
  })(),
  p3: [
      {date: '0', value: 44.9250977976054},
      {date: '0.5', value: 47.9781237289086},
      {date: '1.5', value: 52.1985946900997},
      {date: '2.5', value: 55.2632177988627},
      {date: '3.5', value: 57.7304929347406},
      {date: '4.5', value: 59.8256861622673},
      {date: '5.5', value: 61.6638370896265},
      {date: '6.5', value: 63.312242388854},
      {date: '7.5', value: 64.8139541988347},
      {date: '8.5', value: 66.1983256978706},
      {date: '9.5', value: 67.4863482409871},
      {date: '10.5', value: 68.693603040503},
      {date: '11.5', value: 69.8320014339409},
      {date: '12.5', value: 70.9108782371828},
      {date: '13.5', value: 71.9376972069369},
      {date: '14.5', value: 72.9185302489553},
      {date: '15.5', value: 73.8583906008274},
      {date: '16.5', value: 74.7614707523533},
      {date: '17.5', value: 75.63131645364},
      {date: '18.5', value: 76.4709562790104},
      {date: '19.5', value: 77.2830000089799},
      {date: '20.5', value: 78.0697142878296},
      {date: '21.5', value: 78.8330817172154},
      {date: '22.5', value: 79.5748455580292},
      {date: '23.5', value: 80.2965565913491},
      {date: '24.5', value: 80.9995872983678},
      {date: '25.5', value: 81.7446395330885},
      {date: '26.5', value: 82.4736527307001},
      {date: '27.5', value: 83.188122057027},
      {date: '28.5', value: 83.8893068413842},
      {date: '29.5', value: 84.5782638893427},
      {date: '30.5', value: 85.2558869161821},
      {date: '31.5', value: 85.9229395984847},
      {date: '32.5', value: 86.5800851110585},
      {date: '33.5', value: 87.2279127412898},
      {date: '34.5', value: 87.8669617158391},
      {date: '35.5', value: 88.4977409604969}
  ],
  p5: [
      {date: '0', value: 45.5684090997953},
      {date: '0.5', value: 48.5580920591964},
      {date: '1.5', value: 52.7261065869033},
      {date: '2.5', value: 55.7734505006415},
      {date: '3.5', value: 58.2374433948044},
      {date: '4.5', value: 60.3364690517742},
      {date: '5.5', value: 62.1826080663385},
      {date: '6.5', value: 63.8416613064386},
      {date: '7.5', value: 65.3558384891164},
      {date: '8.5', value: 66.7539798471866},
      {date: '9.5', value: 68.0567455477914},
      {date: '10.5', value: 69.2794921906571},
      {date: '11.5', value: 70.4339743086492},
      {date: '12.5', value: 71.5294120412332},
      {date: '13.5', value: 72.573183808992},
      {date: '14.5', value: 73.5712963119119},
      {date: '15.5', value: 74.5287118963997},
      {date: '16.5', value: 75.4495825856131},
      {date: '17.5', value: 76.3374213958132},
      {date: '18.5', value: 77.1952300188364},
      {date: '19.5', value: 78.0255958397382},
      {date: '20.5', value: 78.8307666113033},
      {date: '21.5', value: 79.612708816061},
      {date: '22.5', value: 80.3731528544819},
      {date: '23.5', value: 81.1136348241789},
      {date: '24.5', value: 81.835518175749},
      {date: '25.5', value: 82.581353443818},
      {date: '26.5', value: 83.3110528286648},
      {date: '27.5', value: 84.0260900564991},
      {date: '28.5', value: 84.7276916167264},
      {date: '29.5', value: 85.4168802715866},
      {date: '30.5', value: 86.0945174468316},
      {date: '31.5', value: 86.7613389249827},
      {date: '32.5', value: 87.4179858742151},
      {date: '33.5', value: 88.0650320338},
      {date: '34.5', value: 88.7030074483648},
      {date: '35.5', value: 89.3324183664647}
  ],
  p10: [
      {date: '0', value: 46.5542930191283},
      {date: '0.5', value: 49.4578038295636},
      {date: '1.5', value: 53.5536465659792},
      {date: '2.5', value: 56.5777214480317},
      {date: '3.5', value: 59.0383022664733},
      {date: '4.5', value: 61.1440960517707},
      {date: '5.5', value: 63.002959620743},
      {date: '6.5', value: 64.6785365049069},
      {date: '7.5', value: 66.2118122523828},
      {date: '8.5', value: 67.6308774877649},
      {date: '9.5', value: 68.9559062937649},
      {date: '10.5', value: 70.2019246073148},
      {date: '11.5', value: 71.3804554654194},
      {date: '12.5', value: 72.5005495820495},
      {date: '13.5', value: 73.5694592157624},
      {date: '14.5', value: 74.5930947130448},
      {date: '15.5', value: 75.5763433306313},
      {date: '16.5', value: 76.5232975362633},
      {date: '17.5', value: 77.4374223484628},
      {date: '18.5', value: 78.3216802341811},
      {date: '19.5', value: 79.1786261007151},
      {date: '20.5', value: 80.0104805083643},
      {date: '21.5', value: 80.8191869414724},
      {date: '22.5', value: 81.6064574952835},
      {date: '23.5', value: 82.3738080633518},
      {date: '24.5', value: 83.1225894944865},
      {date: '25.5', value: 83.8724497800876},
      {date: '26.5', value: 84.6057624632736},
      {date: '27.5', value: 85.3239891157348},
      {date: '28.5', value: 86.0283299569244},
      {date: '29.5', value: 86.7197799432531},
      {date: '30.5', value: 87.3991747668398},
      {date: '31.5', value: 88.0672298826861},
      {date: '32.5', value: 88.7245734534635},
      {date: '33.5', value: 89.3717742721354},
      {date: '34.5', value: 90.0093653632044},
      {date: '35.5', value: 90.6378640422833}
  ],
  p25: [
      {date: '0', value: 48.1893738140463},
      {date: '0.5', value: 50.979188894577},
      {date: '1.5', value: 54.9791044093995},
      {date: '2.5', value: 57.9743988163658},
      {date: '3.5', value: 60.4343343865457},
      {date: '4.5', value: 62.5540884936898},
      {date: '5.5', value: 64.4354633830482},
      {date: '6.5', value: 66.1389573500098},
      {date: '7.5', value: 67.7037500029861},
      {date: '8.5', value: 69.1568171782938},
      {date: '9.5', value: 70.5176063572942},
      {date: '10.5', value: 71.8006481524649},
      {date: '11.5', value: 73.0171184560636},
      {date: '12.5', value: 74.1758148300991},
      {date: '13.5', value: 75.2838018914029},
      {date: '14.5', value: 76.3468477709515},
      {date: '15.5', value: 77.3697300415551},
      {date: '16.5', value: 78.3564553342004},
      {date: '17.5', value: 79.3104206167123},
      {date: '18.5', value: 80.2345338332348},
      {date: '19.5', value: 81.1313057809738},
      {date: '20.5', value: 82.0029210701211},
      {date: '21.5', value: 82.8512937059361},
      {date: '22.5', value: 83.6781129605404},
      {date: '23.5', value: 84.484870913977},
      {date: '24.5', value: 85.2729040435318},
      {date: '25.5', value: 86.0370290207216},
      {date: '26.5', value: 86.7832934580158},
      {date: '27.5', value: 87.5131740027243},
      {date: '28.5', value: 88.227875866497},
      {date: '29.5', value: 88.9284011706542},
      {date: '30.5', value: 89.6155978698257},
      {date: '31.5', value: 90.2902017684162},
      {date: '32.5', value: 90.9528710722229},
      {date: '33.5', value: 91.6042146714144},
      {date: '34.5', value: 92.2448151465021},
      {date: '35.5', value: 92.8752486107173}
  ],
  p50: [
      {date: '0', value: 49.988884079},
      {date: '0.5', value: 52.695975301},
      {date: '1.5', value: 56.628428552},
      {date: '2.5', value: 59.608953427},
      {date: '3.5', value: 62.077000266},
      {date: '4.5', value: 64.216864104},
      {date: '5.5', value: 66.125314898},
      {date: '6.5', value: 67.860179904},
      {date: '7.5', value: 69.459084582},
      {date: '8.5', value: 70.948039123},
      {date: '9.5', value: 72.345861109},
      {date: '10.5', value: 73.666654103},
      {date: '11.5', value: 74.921297174},
      {date: '12.5', value: 76.118375358},
      {date: '13.5', value: 77.264799111},
      {date: '14.5', value: 78.366223087},
      {date: '15.5', value: 79.427340501},
      {date: '16.5', value: 80.452094919},
      {date: '17.5', value: 81.443836034},
      {date: '18.5', value: 82.405436434},
      {date: '19.5', value: 83.339380627},
      {date: '20.5', value: 84.247833944},
      {date: '21.5', value: 85.132696575},
      {date: '22.5', value: 85.995648803},
      {date: '23.5', value: 86.838175097},
      {date: '24.5', value: 87.661609339},
      {date: '25.5', value: 88.452472817},
      {date: '26.5', value: 89.223264339},
      {date: '27.5', value: 89.975492278},
      {date: '28.5', value: 90.710408526},
      {date: '29.5', value: 91.429077621},
      {date: '30.5', value: 92.132423789},
      {date: '31.5', value: 92.821271673},
      {date: '32.5', value: 93.496379457},
      {date: '33.5', value: 94.158465459},
      {date: '34.5', value: 94.808229231},
      {date: '35.5', value: 95.446369813}
  ],
  p75: [
      {date: '0', value: 51.7712574852631},
      {date: '0.5', value: 54.4405431340853},
      {date: '1.5', value: 58.3505940783497},
      {date: '2.5', value: 61.33788093201},
      {date: '3.5', value: 63.8254260405793},
      {date: '4.5', value: 65.9913066287385},
      {date: '5.5', value: 67.9293475879754},
      {date: '6.5', value: 69.6957947027878},
      {date: '7.5', value: 71.3273536202234},
      {date: '8.5', value: 72.8494700064575},
      {date: '9.5', value: 74.2806018978287},
      {date: '10.5', value: 75.6346184545689},
      {date: '11.5', value: 76.9222432757408},
      {date: '12.5', value: 78.1519584863021},
      {date: '13.5', value: 79.3306066926996},
      {date: '14.5', value: 80.4637989233865},
      {date: '15.5', value: 81.5562016910643},
      {date: '16.5', value: 82.6117438683462},
      {date: '17.5', value: 83.6337690011812},
      {date: '18.5', value: 84.625149679001},
      {date: '19.5', value: 85.5883747924065},
      {date: '20.5', value: 86.5256171998123},
      {date: '21.5', value: 87.4387868475588},
      {date: '22.5', value: 88.3295747071967},
      {date: '23.5', value: 89.1994789390605},
      {date: '24.5', value: 90.0498454931164},
      {date: '25.5', value: 90.8787005572373},
      {date: '26.5', value: 91.6846760256571},
      {date: '27.5', value: 92.4692889214632},
      {date: '28.5', value: 93.2338474937995},
      {date: '29.5', value: 93.9795084259939},
      {date: '30.5', value: 94.7073165354158},
      {date: '31.5', value: 95.4182388451418},
      {date: '32.5', value: 96.1131921689973},
      {date: '33.5', value: 96.7930650441201},
      {date: '34.5', value: 97.4587349014246},
      {date: '35.5', value: 98.1110826134703}
  ],
  p90: [
      {date: '0', value: 53.3615347489539},
      {date: '0.5', value: 56.0344409944283},
      {date: '1.5', value: 59.9664032927709},
      {date: '2.5', value: 62.9815810038618},
      {date: '3.5', value: 65.4985800404481},
      {date: '4.5', value: 67.6940478686016},
      {date: '5.5', value: 69.6612233008438},
      {date: '6.5', value: 71.4560916317014},
      {date: '7.5', value: 73.1152468262671},
      {date: '8.5', value: 74.6640975696173},
      {date: '9.5', value: 76.1211038001601},
      {date: '10.5', value: 77.5001582544642},
      {date: '11.5', value: 78.8120169668475},
      {date: '12.5', value: 80.0652015503418},
      {date: '13.5', value: 81.2665956603052},
      {date: '14.5', value: 82.4218515364754},
      {date: '15.5', value: 83.5356759291034},
      {date: '16.5', value: 84.6120363751048},
      {date: '17.5', value: 85.6543131460014},
      {date: '18.5', value: 86.6654134890358},
      {date: '19.5', value: 87.6478588148759},
      {date: '20.5', value: 88.6038524153657},
      {date: '21.5', value: 89.5353326608376},
      {date: '22.5', value: 90.4440154924459},
      {date: '23.5', value: 91.3314274071703},
      {date: '24.5', value: 92.1989349712012},
      {date: '25.5', value: 93.0714335250574},
      {date: '26.5', value: 93.9181746482636},
      {date: '27.5', value: 94.7406366331136},
      {date: '28.5', value: 95.5401622624724},
      {date: '29.5', value: 96.3179956489321},
      {date: '30.5', value: 97.0753111049134},
      {date: '31.5', value: 97.8132366010555},
      {date: '32.5', value: 98.5328725420431},
      {date: '33.5', value: 99.2353065322745},
      {date: '34.5', value: 99.9216248249548},
      {date: '35.5', value: 100.592921223266}
  ],
  p95: [
      {date: '0', value: 54.3072119715771},
      {date: '0.5', value: 56.9990773731045},
      {date: '1.5', value: 60.9646537916633},
      {date: '2.5', value: 64.0078854888541},
      {date: '3.5', value: 66.5488903032389},
      {date: '4.5', value: 68.7653775717319},
      {date: '5.5', value: 70.7512829895234},
      {date: '6.5', value: 72.5630679790426},
      {date: '7.5', value: 74.2376674565529},
      {date: '8.5', value: 75.8007440832438},
      {date: '9.5', value: 77.2709525026483},
      {date: '10.5', value: 78.6623393606722},
      {date: '11.5', value: 79.9857821808662},
      {date: '12.5', value: 81.2499031578935},
      {date: '13.5', value: 82.4616686472545},
      {date: '14.5', value: 83.6268000285099},
      {date: '15.5', value: 84.7500624094899},
      {date: '16.5', value: 85.8354730177395},
      {date: '17.5', value: 86.8864547305889},
      {date: '18.5', value: 87.9059515746162},
      {date: '19.5', value: 88.8965168737897},
      {date: '20.5', value: 89.8603817616653},
      {date: '21.5', value: 90.7995090121291},
      {date: '22.5', value: 91.7156346758992},
      {date: '23.5', value: 92.6103075004739},
      {date: '24.5', value: 93.4849087336022},
      {date: '25.5', value: 94.3877452248001},
      {date: '26.5', value: 95.2630007597693},
      {date: '27.5', value: 96.1121011988834},
      {date: '28.5', value: 96.9363947623564},
      {date: '29.5', value: 97.7371728943947},
      {date: '30.5', value: 98.5156910420506},
      {date: '31.5', value: 99.2731837770055},
      {date: '32.5', value: 100.010876547669},
      {date: '33.5', value: 100.729994719356},
      {date: '34.5', value: 101.431770491437},
      {date: '35.5', value: 102.117447218662}
  ],
  p97: [
      {date: '0', value: 54.9190044535762},
      {date: '0.5', value: 57.6298432273064},
      {date: '1.5', value: 61.6259148751262},
      {date: '2.5', value: 64.6924090907813},
      {date: '3.5', value: 67.2518959664659},
      {date: '4.5', value: 69.4835396581404},
      {date: '5.5', value: 71.4821822482071},
      {date: '6.5', value: 73.3048834934378},
      {date: '7.5', value: 74.9889928197064},
      {date: '8.5', value: 76.56047112136},
      {date: '9.5', value: 78.0381936701244},
      {date: '10.5', value: 79.4363749829669},
      {date: '11.5', value: 80.7660206662514},
      {date: '12.5', value: 82.0358547387811},
      {date: '13.5', value: 83.2529242781077},
      {date: '14.5', value: 84.423015699161},
      {date: '15.5', value: 85.5509470424253},
      {date: '16.5', value: 86.6407790212955},
      {date: '17.5', value: 87.6959705150485},
      {date: '18.5', value: 88.719495577574},
      {date: '19.5', value: 89.7139327257165},
      {date: '20.5', value: 90.6815343572731},
      {date: '21.5', value: 91.6242812892597},
      {date: '22.5', value: 92.5439238858898},
      {date: '23.5', value: 93.4420266333203},
      {date: '24.5', value: 94.3199804224951},
      {date: '25.5', value: 95.244192989933},
      {date: '26.5', value: 96.1396161063495},
      {date: '27.5', value: 97.0076278952572},
      {date: '28.5', value: 97.8495720091331},
      {date: '29.5', value: 98.6667667910477},
      {date: '30.5', value: 99.460520266677},
      {date: '31.5', value: 100.232139112685},
      {date: '32.5', value: 100.982935160837},
      {date: '33.5', value: 101.714230134913},
      {date: '34.5', value: 102.427359159181},
      {date: '35.5', value: 103.12367158862}
  ]
}

export {
    dataSource
  }

