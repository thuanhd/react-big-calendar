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
              timeSlot={4}
              scale={5}
              dayOffs={[2,4]}
              practitioners={[{
                key: 'p1',
                value: 'John Cena',
                workingHours: {
                  from: 9,
                  to: 12,
                }
              },{
                key: 'p2',
                value: 'Taka',
                workingHours: {
                  from: 14,
                  to: 17,
                }
              }]}
              onItemChanged={(event, practitioner) => this.handleItemChanged(event, practitioner)}
              onItemClicked={(event, practitioner) => this.handleItemClicked(event, practitioner)}
              onNewItemClicked={event => this.onNewItemClicked(event)}
              data={data}
              showFormatter={(event) => this.formater(event)}
              date={moment('2018-01-14').toDate()}
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
| `data` | `event[]` | Các events được hiển thị trên Calendar | `[{id:1,title:'Khám sức khỏe',start: new Date(2018,0,1,10,30,0),end: new Date(2018,0,1,12,45,0),group:'Mr An'}]` |
| `date` | `Date` | Ngày tham chiếu | `new Date()` |
| `timeSlot` | `number` | số slot trong một giờ | truyền vào `5` slots thì mỗi slot sẽ có giá trị là 12 phút |
| `scale` | `number` | Số lượng ngày hiển thị, truyền vào 7 nếu muốn hiển thị cả tuần, truyền vào một số khác 7 sẽ được tính như sau: trước ngày hiện tại = Math.floor((x-1)/2), sau ngày hiện tại = Math.ceil((x-1)/2) | ví dụ truyền vào `4` thì hiển thị 1 ngày trước, ngày hiện tại và 2 ngày sau |
| `dayHourRange` | `Object({from:number, to:number})` | Range giờ hoạt động của toàn calendar | `{from:8,to:17}` từ 8 giờ sáng đến 5 giờ chiều |
| `dayOffs` | `number[]` | các ngày nghỉ 0-6 tương ứng t2-CN | `[5,6]` (thứ 7 và chủ nhật) |
| `practitioners` | `practitioner[]` | Các nhóm muốn hiển thị trên Calendar | `[{key: 'p1',value: 'John Cena',workingHours: {from: 9,to: 12,}},{key: 'p2',value: 'Taka', workingHours: { from: 14, to: 17, }}]` |
| `showFormatter` | `(event)=>string` | hàm nhận single data object và trả về text để hiển thị lên 1 event block  | `(event) => event.value` |



### object event

Mỗi `event` gồm các field như bên dưới:
 * `key` (type: `string|number`): dùng để định danh cho 1 `event`
 * `value` (type: `string`): Value của `event`
 * `start` (type: `Date`): Thời điểm bắt đầu của `event`
 * `end` (type: `Date`): Thời điểm kết thúc của `event`
 * `practitionerKey` (type: `string`): định danh nhóm của `event`
 * `unavailable` (type: `boolean`): is unavailable của một `event`, div chứa `event` sẽ có thêm class `unavailableBlock` nếu field này bằng `true`
 
 ### object practitioner
 
 Mỗi `practitioner` gồm các field như bên dưới
 * `key` (type: `string`): dùng để định danh cho 1 `practitioner`
 * `value` (type: `string`): giá trị hiển thị trên calendar
 * `workingHours` (type: `{from:number,to:number}`): giờ làm việc

## Event Handler

| Event | Type | Description |
|:---|:---|:---|
| `onItemChanged` | `(e:event,p:practitioner)=>void` | Sự kiện trả ra khi một `event` trên calendar được thay đổi (ví dụ khi kéo thả `event`, khi resize `event`) |
| `onItemClicked` | `(e:event,p:practitioner)=>void` | Sự kiện trả ra khi một `event` trên calendar được click |
| `onCellClicked` | `(e:{start:Date,end:Date,practitioner:practitioner})=>void` | Sự kiện trả ra khi một `cell` trên calendar được click |


