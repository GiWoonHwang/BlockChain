@csrf_exempt
def Ethpage(request):
    try:
        timeBtn = request.POST.get('timeBtn') # 날짜별 페이지 출력하기위해 받아오는 값
        userPK = request.POST.get('userPK') # 없어도 되지만 상의후 결정
        userA = request.POST.get('userA') # 로그인한 계좌
        pandoWall = request.POST.get('pandoWall')
        if timeBtn == '' : # 특정 날짜를 입력하지 않으면 == 입금/출금/전체 내역만 보기 원한다면 사실 지워도 되지만 eden님과 상의
          timeStart = request.POST.get('timeStart') # db에 들어있는 timestamp의 초기 시간값 받아옴
          timeEnd = request.POST.get('timeEnd') # db에 들어있는 timestamp의 끝 시간값 받아옴
          print(timeStart, ' - ', timeEnd)
          
          # 장고 orm에서 Q는 or을 의미한다. 앞에 ~를 붙였으니 부정이되어 ~Q가 아닌것이라는 필터처리가 됨
          # order_by('-timeStamp')는 내림차순, 가장 최근 게시물이 위에 온다.
          # serializers.serialize('json', timeValue)는 큰의미를 가지지 않아도 된다.
          # count를 하는 count 값을 front에서 받아서 빈페이지 일때 출력할 문구를 결정할 수 있다.
          # fromAddr가 모계좌인건 사실 우리 로직에서는 의미없는 기능이다. 일단은 삭제 보류
          
          # 입금페이지
          # 0xa155ABc1DA12012702E32F29eE3d91472866eaD8는 임의의 모계좌 값 입니다.
          if pandoWall == 'in':
            print('in')
            timeValue = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [timeStart, timeEnd], gasUsed = 21000, toAddr = userA).order_by('-timeStamp')
            timeValueCount = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [timeStart, timeEnd], gasUsed = 21000, toAddr = userA).count()
            timeValue = serializers.serialize('json', timeValue)
          # 출금 페이지
          elif pandoWall == 'out':
            print('out')
            timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [timeStart, timeEnd], gasUsed = 21000, fromAddr = userA).order_by('-timeStamp')
            timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [timeStart, timeEnd], gasUsed = 21000, fromAddr = userA).count()
            timeValue = serializers.serialize('json', timeValue)
          # 전체 페이지
          elif pandoWall == 'all':
            print('all')
            timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [timeStart, timeEnd], gasUsed = 21000).order_by('-timeStamp')
            timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [timeStart, timeEnd], gasUsed = 21000).count()
            timeValue = serializers.serialize('json', timeValue)
          print('timeValueCount: ', timeValueCount)
        
        
        # 날짜별 페이지 출력을 위한 코드입니다. 추후 필요하면 사용
        # else :
        #   if timeBtn == '오늘':
        #     print('오늘')
        #     now1 = datetime.now()
        #     now1 = now1 - timedelta(days=1)
        #     now2 = now1 + timedelta(days=2)
        #     now1 = now1.strftime('%Y-%m-%d')
        #     now2 = now2.strftime('%Y-%m-%d')
        #     print(now1 , ' - ', now2)
        #     if pandoWall == 'in':
        #       print('in')
        #       timeValue = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now1, now2], gasUsed = 21000, toAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now1, now2], gasUsed = 21000, toAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'out':
        #       print('out')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now1, now2], gasUsed = 21000, fromAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now1, now2], gasUsed = 21000, fromAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'all':
        #       print('all')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now1, now2], gasUsed = 21000).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now1, now2], gasUsed = 21000).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     print('timeValueCount: ', timeValueCount)
        #   elif timeBtn == '1개월':
        #     print('1개월')
        #     now1 = datetime.now()
        #     now1 = now1 + timedelta(days=1)
        #     now2 = now1 - timedelta(days=30)
        #     now1 = now1.strftime('%Y-%m-%d')
        #     now2 = now2.strftime('%Y-%m-%d')
        #     print(now2, ' ~ ', now1)
        #     if pandoWall == 'in':
        #       print('in')
        #       timeValue = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, toAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, toAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'out':
        #       print('out')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000, fromAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, fromAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'all':
        #       print('all')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     print('timeValueCount: ', timeValueCount)
        #   elif timeBtn == '3개월':
        #     print('3개월')
        #     now1 = datetime.now()
        #     now1 = now1 + timedelta(days=1)
        #     now2 = now1 - timedelta(days=90)
        #     now1 = now1.strftime('%Y-%m-%d')
        #     now2 = now2.strftime('%Y-%m-%d')
        #     print(now2, ' ~ ', now1)
        #     if pandoWall == 'in':
        #       print('in')
        #       timeValue = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, toAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(fromAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, toAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'out':
        #       print('out')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000, fromAddr = userA).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'),timeStamp__range = [now2, now1], gasUsed = 21000, fromAddr = userA).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     elif pandoWall == 'all':
        #       print('all')
        #       timeValue = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000).order_by('-timeStamp')
        #       timeValueCount = EthScan.objects.filter(~Q(toAddr = '0xa155ABc1DA12012702E32F29eE3d91472866eaD8'), timeStamp__range = [now2, now1], gasUsed = 21000).count()
        #       timeValue = serializers.serialize('json', timeValue)
        #     print('timeValueCount: ', timeValueCount)
        context = {'result':'1', 'timeValue': timeValue, 'timeValueCount': timeValueCount}
        return HttpResponse(json.dumps(context))
    except Exception as error:
        print('myProfileDel', error)