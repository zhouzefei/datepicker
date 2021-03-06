(function(){
	var datePick=function (el,opt){
		this.el=el||'timePicker';
		this.leapmonths=[31,29,31,30,31,30,31,31,30,31,30,31];//非闰年
		this.months=[31,28,31,30,31,30,31,31,30,31,30,31];//闰年
		this.nowTime=(new Date().getFullYear())+"/"+(new Date().getMonth()+1)+"/"+(new Date().getDate());
		this.rang={st:this.nowTime,ed:this.nowTime+" 23:59:59"};
		this.defaultMonth={y:(new Date().getFullYear()),m:(new Date().getMonth()+1),d:(new Date().getDate())};
		this.firstClick='';
		this.secondClick='';
		this.lastDefaultMonth={y:((this.defaultMonth.m==1)?(this.defaultMonth.y-1):this.defaultMonth.y),m:((this.defaultMonth.m==1)?12:(this.defaultMonth.m-1)),d:1};
		this.defaultDate=[];
		this.defaults = {
	        'contact': false,
	        'module': 1,
	        'textDecoration':'none'
	    };
	    this.options = $.extend({}, this.defaults, opt)
	};
	datePick.prototype={
		//格式化日期
		dataFormat:function(dayDatetime){
			var __this=this;
			if(dayDatetime)
				var date=new Date(dayDatetime);
			else
				var date=new Date();
			var year=date.getFullYear();
			var weekday=date.getDate();
			var day=date.getDay();
			var month=date.getMonth()+1;
			var dayDate={
				year:year,
				month:month,
				fD:1
			}
			dayDate.eD=(dayDate.year%400==0||(dayDate.year%4==0&&dayDate.year%100!=0))?__this.leapmonths[dayDate.month-1]:__this.months[dayDate.month-1];
			dayDate.fdayDateday=new Date(dayDate.year+"/"+dayDate.month+"/1");
			dayDate.endday=new Date(dayDate.year+"/"+dayDate.month+"/"+dayDate.eD);
			dayDate.headVacancy=dayDate.fdayDateday.getDay();
			dayDate.endVacancy=(6-dayDate.endday.getDay());
			dayDate.data=[];
			var lastMonth={
				year:((month-1)?year:(year-1)),
				month:((month-1)?(month-1):12)
			}
			lastMonth.eD=(lastMonth.year%4==0)?__this.leapmonths[lastMonth.month-1]:__this.months[lastMonth.month-1];
			var nextMonth={
				year:((month+1)>12?(year+1):(year)),
				month:((month+1)<=12?(month+1):12)
			}
			nextMonth.eD=(nextMonth.year%400==0||(nextMonth.year%4==0&&nextMonth.year%100!=0))?__this.leapmonths[nextMonth.month-1]:__this.months[nextMonth.month-1];
			
			var eDay=lastMonth.eD;
			for(var i=dayDate.headVacancy;i>0;i--)
			{
				dayDate.data.unshift({y:lastMonth.year,m:lastMonth.month,d:eDay--,other:true,dsdate:false});
			}
			var now=new Date();
			//var maxtime=new Date(now.getFullYear()+"/"+(now.getMonth()+1)+"/"+(now.getDate())).getTime();
			for(var i=1;i<=dayDate.eD;i++){
				if((new Date().getTime())>(new Date(dayDate.year+"/"+dayDate.month+"/"+i).getTime()))
				dayDate.data.push({y:dayDate.year,m:dayDate.month,d:i,other:false,dsdate:false,active:false});
				else
				dayDate.data.push({y:dayDate.year,m:dayDate.month,d:i,other:false,dsdate:true});
			}
			for(var i=0;i<dayDate.endVacancy;i++){
				if((new Date().getTime())>(new Date(nextMonth.year+"/"+nextMonth.month+"/"+i).getTime()))
				dayDate.data.push({y:nextMonth.year,m:nextMonth.month,d:i+1,other:true,dsdate:true,active:false});
				else
				dayDate.data.push({y:nextMonth.year,m:nextMonth.month,d:i+1,other:true,dsdate:false,active:false});
			}
			var nowYear=(new Date()).getFullYear();
			var nowMonth=(new Date()).getMonth()+1;
			var nowDay=(new Date()).getDate();
			for(var i=0;i<dayDate.data.length;i++)
			{
				var datetime=new Date(dayDate.data[i].y+"/"+dayDate.data[i].m+"/"+dayDate.data[i].d).getTime();
		    	var stime=new Date(__this.rang.st).getTime();
		    	var endtime=new Date(__this.rang.ed).getTime();
		    	if(!dayDate.data[i].other&&datetime>=stime&&datetime<=endtime)
		    	{
		    		dayDate.data[i].active=true;
		    	}
			}
			return dayDate;
		},
		//判断类名
		judgeClass:function(data){
			if(data.other)
			{
				return "ds-date-othermonth";
			}
			else if(!data.other&&data.dsdate){
				return "da-out-time";
			}
			else if(data.active){
				return "ds-date-selected";
			}
			else{
				return "ds-date-thismonth";
			}
		},
		//日期拼接
		getDayHtml:function(dayDate){
			var __this=this;
			var strVar = "";
			for(var i=0;i<(dayDate.data.length);i+=7)
			{
				 strVar += "<tr>";
			    strVar += "	<td class=\"ds-week\" sign=\"week\" style=\"\">";
			    strVar += "	<\/td>";
			    for(var k=0;k<7;k++)
			    {
			    	strVar += "	<td sign=\"\" style=\"\" class=\""+this.judgeClass(dayDate.data[i+k])+"\" y=\""+dayDate.data[i+k].y+"\" m=\""+dayDate.data[i+k].m+"\" d=\""+dayDate.data[i+k].d+"\">";
			    	strVar += 	(dayDate.data[i+k].other?"":dayDate.data[i+k].d);
			    	strVar += "	<\/td>";
			    }
			    strVar += "<\/tr>";
			}
			return strVar;
		},
		//月日计算
		setpickday:function(day){
			var __this=this;
			var date=new Date(day);
			__this.defaultMonth={y:(date.getFullYear()),m:(date.getMonth()+1),d:(date.getDate())};
			__this.lastDefaultMonth={y:((__this.defaultMonth.m==1)?(__this.defaultMonth.y-1):__this.defaultMonth.y),m:((__this.defaultMonth.m==1)?12:(__this.defaultMonth.m-1)),d:(date.getDate())};
		},
		//设置选中日期范围
		setSelectDay:function(start,end){
			var el=this.el;
			var startInt=start.split('/');
			var endInt=end.split('/');
			for(var i=0; i<startInt.length;i++){
				startInt[i]=parseInt(startInt[i]);
				endInt[i]=parseInt(endInt[i]);
			}
			if(startInt[0]>endInt[0] || (startInt[0]==endInt[0]&&startInt[1]>endInt[1]) || (startInt[0]==endInt[0] && startInt[1]==endInt[1] && startInt[2]>endInt[2])){
				var temp=start;
				start=end;
				end=temp;
			}
			this.rang={st:start,ed:end+" 23:59:59"};
			$("#"+el).next('div').find(".date-from").val(start);
			$("#"+el).next('div').find(".date-to").val(end);
		},
		//时间td
		setTimeTd:function(obj){
			var tdStr='';
			var isFirst=true;
			for(var i=0; i<obj.length;i++){
				var Dayhtml=this.getDayHtml(obj[i]);
				var Y=obj[i].year;
				var M=obj[i].month;
				tdStr+='<td class="ds-cal-wrap LQSayUpkDSCalendarWrap" style="vertical-align: top;">'
		             +'		<div class="ds-cal-head" sign="month" y="'+Y+'" m="'+M+'">'+Y+'年'+M+'月'+'</div>'
		             +'		<table cellpadding="0" cellspacing="0" border="0" class="">'
			         +'    		<thead>'
				     +'        		<tr>'
				     +'        			<td style="background:#fff;" class="ds-week"></td>'
				     +'        			<td>日</td>'
				     +'        			<td>一</td>'
				     +'        			<td>二</td>'
				     +'        			<td>三</td>'
				     +'        			<td>四</td>'
				     +'        			<td>五</td>'
				     +'        			<td>六</td>'
				     +'        		</tr>'
				     +'        	</thead>'
				     +'        	<tbody>'
				     +				Dayhtml
				     +'			</tbody>'
			         +'    	</table>'
					 +'	</td>';
				if(obj.length>1 && isFirst){
					tdStr+='<td class="ds-cal-blank"></td>';
					isFirst=false;
				}
			}
			return tdStr;
		},
		//年月日渲染方法
		setHtml:function(){
			var __this=this;
			var el=this.el;
			var tdStr=__this.setTimeTd(__this.defaultDate);
			var innerStr='';
			innerStr='    	<table class="ds-wrap">'
		            +'    		 <tbody>'
		            +'    			<tr>'
		            +'    				<td class="ds-prev" style="vertical-align: top;">'
		            +'    					<div class="ds-prevyear DSPrevYear" sign="prevyear"></div>'
		            +'    					<div class="ds-prevmonth DSPrevMonth"  sign="prevmonth"></div>'
		            +'					</td>'
		            +					tdStr
		            +'					<td class="ds-next zscnOWzpnextSide" style="vertical-align: top;">'
		            +'						<div class="ds-nextyear DSNextYear"  sign="nextyear"></div>'
		            +'						<div class="ds-nextmonth DSNextMonth"  sign="nextmonth"></div>'
		            +'					</td>'
		            +'    			</tr>'
		            +'			</tbody>'
		            +'    	</table>';
			$("#"+el).next('div').find('.date-calendar-body').html(innerStr);
			__this.firstClick=__this.nowTime;
		},
		render:function(){
			this.defaultDate[0]=this.dataFormat(this.lastDefaultMonth.y+"/"+this.lastDefaultMonth.m);
			this.defaultDate[1]=this.dataFormat(this.defaultMonth.y+"/"+this.defaultMonth.m);
			this.setHtml();
		},
		prevYear:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .DSPrevYear',function(){
				var year=__this.defaultDate[1].year;
				var month=__this.defaultDate[1].month;
				year--;
				__this.setpickday(year+"/"+month);		
				__this.render();
				__this.nextClass(year,month);
			});
		},
		nextYear:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .DSNextYear',function(){
				var year=__this.defaultDate[1].year;
				var month=__this.defaultDate[1].month;
				var thisY=(new Date()).getFullYear();
				if(year<thisY){
					year++;
					__this.setpickday(year+"/"+month);		
					__this.render();
					__this.nextClass(year,month);
				}else{
					return false;
				}
			});
		},
		prevMonth:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .DSPrevMonth',function(){
				var month=__this.defaultDate[1].month;
				var year=__this.defaultDate[1].year;
				if(month==1){
					month=12;
					year--;
				}else{
					month--;
				}
				__this.setpickday(year+"/"+month);		
				__this.render();
				$("#"+el+"+.timePickerBox .DSNextMonth").addClass('ds-nextmonth-ed').removeClass('ds-nextmonthx');
				__this.nextClass(year,month);
			});
		},
		nextMonth:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .DSNextMonth',function(){
				var month=__this.defaultDate[1].month;
				var year=__this.defaultDate[1].year;
				if(month==12){
					month=1;
					year++;
				}else{
					month++;
				}
				__this.setpickday(year+"/"+month);		
				__this.render();
				__this.nextClass(year,month);
			});
		},
		nextClass:function(year,month){
			var el=this.el;
			var thisY=(new Date()).getFullYear();
			var thisM=(new Date()).getMonth()+1;
			if(thisY==year && thisM==month){
				$("#"+el+"+.timePickerBox .DSNextMonth").addClass('ds-nextmonth-ed').removeClass('ds-nextmonth');
			}else{
				$("#"+el+"+.timePickerBox .DSNextMonth").addClass('ds-nextmonth').removeClass('ds-nextmonth-ed');
			}
		},
		toDay:function(nowDay,days){
			var times=nowDay.getTime()-days*24*60*60*1000;
			var prevTimes=new Date();
			prevTimes.setTime(times);
			var thisY=prevTimes.getFullYear();
			var thisM=prevTimes.getMonth()+1;
			var thisD=prevTimes.getDate();
			prevDay=thisY+'/'+thisM+'/'+thisD;
			return prevDay;
		},
		selectDateRange:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .DateSelectBar a',function(e){
				e.preventDefault();
				var days=$(this).attr('data-range');
				var prevDay=__this.toDay(new Date(),days);
				$(this).addClass('cur').siblings().removeClass('cur');
				__this.setSelectDay(prevDay,__this.nowTime); //区域染色
				__this.render();		
			});
		},
		selectTdDate:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click',"#"+el+"+.timePickerBox td[class^='ds-date']",function(){
				var objOrigin=$(this).closest('table.ds-wrap').find('.ds-date-selected');
				if(objOrigin.length>2 || objOrigin.length<1){
					$(".ds-date-selected").attr('class','ds-date-thismonth');
					$(this).attr('class','ds-date-selected');
					__this.firstClick=$(this).attr('y')+'/'+$(this).attr('m')+'/'+$(this).attr('d');
					$("#"+el).next('div').find(".date-from").val(__this.firstClick);
					$("#"+el).next('div').find(".date-to").val(__this.firstClick);
				}else{
					__this.secondClick=$(this).attr('y')+'/'+$(this).attr('m')+'/'+$(this).attr('d');
					__this.setSelectDay(__this.firstClick,__this.secondClick); //区域染色
					__this.render();	
				}
			})
		},
		selectWeek:function(){
			var __this=this;
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .ds-week',function(){
				$(".ds-date-selected").attr('class','ds-date-thismonth');
				var parentObj=$(this).closest('tr').find('.ds-date-thismonth');
				var firstDayObj=parentObj.eq(0);
				var secondDayObj=parentObj.eq(parentObj.length-1);
				var firstDay =firstDayObj.attr('y')+'/'+firstDayObj.attr('m')+'/'+firstDayObj.attr('d');
				var secondDay=secondDayObj.attr('y')+'/'+secondDayObj.attr('m')+'/'+secondDayObj.attr('d');
				__this.setSelectDay(firstDay,secondDay); //区域染色
				__this.render();	
			})
		},
		updateSlectDay:function(){
			var el=this.el;
			var __this=this;
			$("#"+el).on("click",function(e){
				e.stopPropagation();
				$("div.time-picker-box ").hide();
				$(this).next("div.time-picker-box ").show();
				var elSpan=$(this).children('span.text').text();
				var thisY='';
				var thisM='';
				if(elSpan!='选择时间'){
					var timeTemp='';
					if(elSpan.indexOf('~')>-1){
						var time=elSpan.split('~');
						__this.setpickday(time[1]);
						timeTemp=time[1];
						__this.setSelectDay(time[0],time[1]); //区域染色
					}else{
						__this.setpickday(elSpan);
						timeTemp=elSpan;
						__this.setSelectDay(timeTemp,timeTemp); //区域染色
					}
					thisY=timeTemp.split('/')[0];
					thisM=timeTemp.split('/')[1];
				}else{
					thisY=(new Date()).getFullYear();
					thisM=(new Date()).getMonth()+1;
					__this.setpickday(__this.nowTime);		//计算年月日对应数据 当前年月
					$("#"+el).next('div').find(".date-from").val(this.nowTime);
					$("#"+el).next('div').find(".date-to").val(this.nowTime);
				}
				__this.nextClass(thisY,thisM);
				__this.render();					//渲染
			});
		},
		showSpan:function(){
			var el=this.el;
			var __this=this;
			$("body").on('click','#'+el+'+.timePickerBox .button-bar .button',function(){
				var inputObj=$("#"+el).next('div');
				var sTime=inputObj.find(".date-from").val();
				var eTime=inputObj.find(".date-to").val();
				var spanTxt='';
				if (sTime) {
					spanTxt+=sTime;
				};
				if (eTime && sTime!=eTime) {
					spanTxt+='~'+eTime;
				};
				$("#"+el+">span").text(spanTxt);
				//如果默认关联
				if(__this.options.contact){
					$("span.text").text(spanTxt);
				}
				$("div.time-picker-box ").hide();
			});
		},
		cancel:function(){
			var el=this.el;
			$("body").on('click','#'+el+'+.timePickerBox .button-bar .cancel',function(){
				$("div.time-picker-box ").hide();
			});
		},
		init:function(){//初始化
			var el=this.el;
			var wrapHtml=   '<div class="timePickerBox calendar-box time-picker-box layer bg-iframe" style="display:none;">'
				            +'    <form action="javascript:void(0)" class="r date-input">'
				            +'        <fieldset class="date-inpu-tabs">'
				            +'            <span style="display:block;height:31px;width:1px;">&nbsp;</span>'
				            +'            <fieldset class="date-input-tab first cur selected">'
				            +'                <label class="date-input-label" style="display:none;">&nbsp;</label>'
				            +'                <p class="date-input-picker firstDatePicker">'
				            +'                    <input type="text" maxlength="10" class="date-input-short date-from"> - <input type="text" maxlength="10" class="date-input-short date-to">'
				            +'                </p>'
				            +'            </fieldset>'
				            +'            <fieldset class="date-input-tab second">'
				            +'                <label class="date-input-label"><input type="checkbox" class="date-picker-check">对比时间段</label>'
				            +'                <p class="date-input-picker secondDatePicker" style="visibility: hidden;">'
				            +'                    <input type="text" maxlength="10" class="date-input-short date-from "> - <input type="text" maxlength="10" class="date-input-short date-to">'
				            +'                </p>'
				            +'            </fieldset>'
				            +'        </fieldset>'
				            +'        <strong class="date-select-tip">超出时间范围，请重新选择。</strong>'
				            +'        <p class="button-bar" style="margin-right: 10px;">'
				            +'            <a class="button" href="javascript:void(0)">确定</a>'
				            +'            <a class="cancel" href="javascript:void(0)">取消</a>'
				            +'		</p>'
				            +'    </form>'
				            +'    <p class="DateSelectBar date-select-bar">'
				            +'		  <a href="#00" class="trackable date-bar-single-day cur" data-range="0" memo="{id:time_tody}">今天</a>'
				            +'        <a href="#-1,-1" class="trackable" data-range="1" memo="{id:time_yest}">昨天</a>'
				            +'        <a href="#-6" class="trackable" memo="{id:time_week}" data-range="7">最近7天</a>'
				            +'        <a href="#-29" class="trackable" memo="{id:time_month}" data-range="30">最近30天</a>'
				            +'        <a href="#-59" class="trackable" memo="{id:time_two_month}" data-range="60">最近60天</a>'
				            +'    </p>'
				            +'   <div class="date-calendar-body"></div>'
				            +'</div>';
            $("#"+el).after(wrapHtml);
            $('body').on('click',function(){
	        	$("div.time-picker-box ").hide();
	        });
	        $('body').on('click','.time-picker-box',function(e){
	        	e.stopPropagation();
	        });
			this.prevYear();
			this.nextYear();
			this.prevMonth();
			this.nextMonth();
			this.selectDateRange();
			this.updateSlectDay();
			this.selectTdDate();
			this.selectWeek();
			this.showSpan();
			this.cancel();
		}
	};	
     $.DatePicker = function(options){
     	var datepicker=new datePick(options);
     	datepicker.init();
     }
})();
