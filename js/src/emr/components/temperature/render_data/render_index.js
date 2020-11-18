import {BloodPressure} from './render_blood_pressure.js'
import {Normal7} from './render_normal7.js'
import {Breath} from './render_breath.js'
import {TimeBar} from './render_time_bar.js'
// import {Pain} from './render_pain.js'
// import {Zt} from './render_zt.js'
import {Temperature} from './render_temperature.js'
import {Cooling} from './render_cooling.js'
import {Pulse} from './render_pulse.js'
import {Heart} from './render_heart.js'
import {Event} from './render_event.js'
export class RenderData {
  renderData () {
    // 正常的7列数据渲染
    new Normal7().renderData()
    // 血压数据渲染
    new BloodPressure().renderData()
    // 呼吸数据渲染
    new Breath().renderData()
    // 时间轴
    new TimeBar().renderData()
    // 疼痛曲线
    // new Pain().renderData()
    // new Zt().renderData()
    // 脉搏
    new Pulse().renderData()
    // 心率
    new Heart().renderData()
    // 体温
    new Temperature().renderData()
    new Cooling().renderData()
    // 事件
    new Event('statusUp').renderData()
    new Event('statusDown').renderData()
  }
}
