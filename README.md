react-big-calendar
========================

Lib react-ht-calendar

## Sử dụng
```
npm install https://github.com/thuanhd/react-ht-calendar.git --save
```
### Include các file styles

Sau khi install lib xong, vào folder `node_modules/react-ht-calendar/lib/css/` sẽ thấy file `react-big-calendar.css`, copy file này vào assets và link vào html page của mình

### Include jquery

Hiện lib đang require jquery, cần link jQuery vào page
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```
### Sử dụng component
```
import {HTCalendar} from 'ht-calendar'
```
```
<HTCalendar
        visibleDates={visibleDates}
        groups={['John Cena', 'Taka']}
        onItemChanged={event => this.handleItemChanged(event)}
        onItemClicked={event => this.handleItemClicked(event)}
        onCellClicked={event => this.handleCellClicked(event)}
        dataSet={dataSet}
      />
```
xem ví dụ ở repo này: https://github.com/thuanhd/ht-calendar

## Chạy examples local

* Clone repository
* Install: `npm install`
* Start: `npm run examples`
* Open [localhost:3000/examples/index.html](http://localhost:3000/examples/index.html).

## Input


| Parameter | Type | Description | Ví dụ |
|:---|:---|:---|:---|
| `dataSet` | `event[]` | Các events được hiển thị trên Calendar | `[{id:1,title:'Khám sức khỏe',start: new Date(2018,0,1,10,30,0),end: new Date(2018,0,1,12,45,0),group:'Mr An'}]` |
| `date` | `Date` | Ngày hiện tại (giá trị sẽ được highlight là ngày hiện tại trên calendar) | `new Date()` |
| `visibleDates` | `Date[]` | Danh sách các ngày sẽ được hiển thị trên calendar | `[new Date(2018,0,1),new Date(2018,0,2),new Date(2018,0,3),]` |
| `workingHourRange` | `Object({from:number, to:number})` | Thời gian làm việc trong một ngày (những cell nằm ngoài thời gian làm việc sẽ có màu xám) | `{from:8,to:17}` từ 8 giờ sáng đến 5 giờ chiều |
| `dayOffs` | `number[]` | Các ngày nghỉ trong tuần từ thứ 2 đến chủ nhật theo thứ tự từ số 1 đến số 7 | `[6,7]` (thứ 7 và chủ nhật) |
| `groups` | `string[]` | Các nhóm muốn hiển thị trên Calendar | `['Mr An','Mr Ha']` |



### object event

Mỗi `event` gồm các field như bên dưới:
 * `id` (type: `string|number`): dùng để định danh cho 1 `event`
 * `title` (type: `string`): Tiêu đề của `event`
 * `start` (type: `Date`): Thời điểm bắt đầu của `event`
 * `end` (type: `Date`): Thời điểm kết thúc của `event`
 * `group` (type: `string`): định danh nhóm của `event`

## Event Handler

| Event | Type | Description |
|:---|:---|:---|
| `onItemChanged` | `(e:event)=>void` | Sự kiện trả ra khi một `event` trên calendar được thay đổi (ví dụ khi kéo thả `event`, khi resize `event`) |
| `onItemClicked` | `(e:event)=>void` | Sự kiện trả ra khi một `event` trên calendar được click |
| `onCellClicked` | `(e:{start:Date,end:Date})=>void` | Sự kiện trả ra khi một `cell` trên calendar được click |


