"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/common/Card"
import Button from "@/components/common/Button"
import { Plus, FileText, Edit, Clock, Calendar as CalendarIcon } from "lucide-react"
import { colors } from "@/constants/colors"
import { UserInfo } from "@/components/common/UserInfo"
import ConsultationCalendar, { Consultation, formatDate, formatTime } from "@/components/common/Calendar"
import Sheet from '@/components/common/Sheet'
import { useRouter } from 'next/navigation'
import { useYouthConsultationStore } from '@/stores/useYouthConsultaionStore'

interface CounselingLogItem {
  id: number;
  consultationDate: string;
  voiceFileUrl?: string;
  fullScript?: string;
  summarize?: string;
  counselorKeyword?: string;
  clientKeyword?: string;
  memoKeyword?: string;
  counselingProcess?: string;
  isolatedYouth?: {
    id?: number;
    isolationLevel?: string;
    economicLevel?: string;
    economicActivityRecent?: string;
    isolatedScore?: number;
    surveyProcessStep?: string;
    personalInfo?: {
      id?: number;
      name?: string;
      phoneNumber?: string;
      birthDate?: string;
      emergencyContact?: string;
      age?: number;
    };
  };
  user?: {
    id?: number;
    userId?: string;
    name?: string;
    role?: number;
  };
}

export default function ConsultationManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [consultations, setConsultations] = useState<Consultation[]>([])
  // const consultations : Consultation[] = [
  //   {
  //     id: '1',
  //     clientId: '1',
  //     clientName: '이OO',
  //     clientAge: 20,
  //     clientGender: '남',
  //     title: '심리상담',
  //     type: '심리상담',
  //     date: new Date(2025, 4, 10, 10, 0), // 2025년 5월 10일 10시
  //     time: '10:00',
  //     status: '완료',
  //     notes: '초기 상담'
  //   },
  //   {
  //     id: '2',
  //     clientId: '2',
  //     clientName: '김OO',
  //     clientAge: 22,
  //     clientGender: '여',
  //     title: '직업상담',
  //     type: '직업상담',
  //     date: new Date(2025, 4, 13, 14, 0), // 2025년 5월 13일 14시
  //     time: '14:00',
  //     status: '미작성',
  //     notes: '취업 상담'
  //   },
  //   {
  //     id: '3',
  //     clientId: '3',
  //     clientName: '박OO',
  //     clientAge: 19,
  //     clientGender: '남',
  //     title: '생활상담',
  //     type: '생활상담',
  //     date: new Date(2025, 4, 13, 16, 0), // 2025년 5월 13일 16시 (같은 날 추가)
  //     time: '16:00',
  //     status: '완료',
  //     notes: '생활 지원 상담'
  //   },
  //   {
  //     id: '4',
  //     clientId: '4',
  //     clientName: '최OO',
  //     clientAge: 21,
  //     clientGender: '여',
  //     title: '심리상담',
  //     type: '심리상담',
  //     date: new Date(2025, 4, 26, 13, 0), // 2025년 5월 26일 13시
  //     time: '13:00',
  //     status: '진행전',
  //     notes: '정기 상담'
  //   },
  //   {
  //     id: '5',
  //     clientId: '5',
  //     clientName: '정OO',
  //     clientAge: 18,
  //     clientGender: '여',
  //     title: '진로상담',
  //     type: '진로상담',
  //     date: new Date(2025, 4, 26, 15, 0), // 2025년 5월 26일 15시 (같은 날 추가)
  //     time: '15:00',
  //     status: '진행전',
  //     notes: '진로 탐색'
  //   },
  //   {
  //     id: '6',
  //     clientId: '6',
  //     clientName: '강OO',
  //     clientAge: 23,
  //     clientGender: '남',
  //     title: '취업상담',
  //     type: '취업상담',
  //     date: new Date(2025, 4, 26, 17, 0), // 2025년 5월 26일 17시 (같은 날 추가)
  //     time: '17:00',
  //     status: '진행전',
  //     notes: '취업 준비'
  //   }
  // ]

  // 선택된 날짜의 일정
  const [selectedDateConsultations, setSelectedDateConsultations] = useState<Consultation[]>([])

  // 선택된 일정
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

  // 날짜 선택 핸들러
  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    
    // 선택된 날짜의 일정 필터링
    const filteredConsultations = consultations.filter(consultation => 
      consultation.date.getFullYear() === date.getFullYear() &&
      consultation.date.getMonth() === date.getMonth() &&
      consultation.date.getDate() === date.getDate()
    ).sort((a, b) => a.date.getTime() - b.date.getTime()) // 시간순 정렬
    
    setSelectedDateConsultations(filteredConsultations)
    setSelectedConsultation(null) // 일정 선택 초기화
  }

  // 일정 선택 핸들러
  const handleConsultationSelect = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
  }

  // 상태에 따른 색상 가져오기
  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행전":
        return "bg-green-500"
      case "완료":
        return "bg-blue-500"
      case "미작성":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const { consultationListByYear, getConsultationListByYear } = useYouthConsultationStore();

  // 초기 로드 시
  useEffect(() => {
    handleDateChange(new Date())
    getConsultationListByYear(new Date().getFullYear())
  }, [])

  useEffect(() => {
    // 백엔드 데이터를 Consultation 타입으로 변환
    const mappedConsultations = consultationListByYear.map((item: CounselingLogItem) => {
      // consultationDate 문자열을 Date 객체로 변환
      const date = new Date(item.consultationDate);
      // 시간 포맷 (HH:MM)
      const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      // 상담 유형 설정 (키워드 기반으로)
      let consultationType = '심리상담';
      if (item.counselorKeyword) {
        if (item.counselorKeyword.includes('적응문제')) consultationType = '적응상담';
        else if (item.counselorKeyword.includes('취업')) consultationType = '취업상담';
        else if (item.counselorKeyword.includes('진로')) consultationType = '진로상담';
        else if (item.counselorKeyword.includes('생활')) consultationType = '생활상담';
      }
      
      // 상담 상태 변환 - Consultation 타입의 status에 맞게 제한
      let status: "완료" | "진행전" | "미작성" = "미작성";
      if (item.counselingProcess === 'COMPLETED') status = '완료';
      else if (item.counselingProcess === 'SCHEDULED') status = '진행전';
      else status = '미작성';
      
      // 날짜 포맷팅 (YYYY. MM. DD. HH:MM)
      const dateString = `${date.getFullYear()}. ${(date.getMonth() + 1).toString().padStart(2, '0')}. ${date.getDate().toString().padStart(2, '0')}.`;
      console.log("dateString : ", dateString);
      console.log("date.getFullYear() : ", date.getFullYear());
      console.log("date.getMonth() : ", date.getMonth());
      console.log("date.getDate() : ", date.getDate());
      console.log("time : ", time);
      
      return {
        id: item.id.toString(),
        clientId: item.isolatedYouth?.personalInfo?.id?.toString() || '',
        clientName: item.isolatedYouth?.personalInfo?.name || '미상',
        clientAge: item.isolatedYouth?.personalInfo?.age || 0,
        clientGender: '남', // 기본값으로 '남' 설정
        consultantName: item.user?.name || '',
        title: consultationType,
        type: consultationType,
        date: date,
        dateString: dateString, // 포맷된 날짜 문자열 추가
        time: time,
        status: status,
        notes: item.summarize || item.fullScript?.substring(0, 50) || '특이사항 없음'
      } as Consultation; // 타입 단언을 통해 Consultation 타입으로 변환
    });
    
    setConsultations(mappedConsultations);
  }, [consultationListByYear]);

  const router = useRouter()
  const handleMakeNewConsultation = () => {
    router.push('/dashboard/consultation-management/makenew')
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        웅상종합사회복지관
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 달력 */}
        
        <Card title='상담 일정 관리' subTitle='날짜를 선택하면 해당 날짜의 상담정보를 확인할 수 있습니다.'>
          <div className='flex flex-col gap-4'>

            <Button 
              variant="primary" 
              className="w-full h-20 flex flex-row items-center justify-center"
              onClick={handleMakeNewConsultation}
            >
              <Plus className="w-4 h-4 mr-1" /> 
              <span>상담 일정 추가</span>
            </Button>

            <ConsultationCalendar 
              consultations={consultations}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card title='상담예정자 관리' subTitle='상담예정자를 선택하면 상세 상담정보를 확인할 수 있습니다.'>
            <div className="flex flex-col gap-4">
              <div className='scrollable-container'>
              {selectedDateConsultations.length > 0 ? (
                <div 
                  className="flex flex-row gap-4 overflow-x-auto"
                  style={{ 
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',  // 터치 디바이스에서 관성 스크롤 활성화
                    paddingBottom: '10px'  // 스크롤바 공간 확보
                  }}
                >
                  {selectedDateConsultations.map((consultation) => (
                    <div 
                    key={consultation.id} 
                    className={`p-4 rounded-lg border ${
                      consultation.status === '진행전' ? 'border-green-200 bg-green-50' : 
                      consultation.status === '완료' ? 'border-blue-200 bg-blue-50' : 
                      'border-red-200 bg-red-50'
                    } cursor-pointer transition hover:shadow-md`}
                    onClick={() => handleConsultationSelect(consultation)}
                    >
                      {/* <div className="mb-3 flex justify-between items-center">
                        <div className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{consultation.time}</span>
                        </div>
                      </div> */}
                      <div className="mb-3 flex justify-between">
                        <div className="text-sm text-gray-600">
                          {consultation.type}
                        </div>
                        <div className="flex space-x-2 gap-2">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{consultation.time}</span>
                          </div>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                            title="상담일지 작성"
                            >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-200 text-gray-500"
                            title="일정 수정"
                            >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className='w-80'>
                        <UserInfo 
                          id={consultation.clientId}
                          name={consultation.clientName}
                          age={consultation.clientAge || 0}
                          // gender={consultation.clientGender || '남'}
                        />  
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="mb-3">
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <p>선택한 날짜에 예정된 상담이 없습니다.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex flex-row items-center justify-center mt-4 text-blue-500 border-blue-500"
                    onClick={handleMakeNewConsultation}
                    >
                    <Plus className="w-4 h-4 mr-1" />
                    <span>일정 추가하기</span>
                  </Button>
                </div>
              )}
            </div>
            {selectedConsultation && (
              <Card>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">상담 대상자</p>
                      <p className="font-medium">{selectedConsultation.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">상담 일시</p>
                      <p className="font-medium">
                        {formatDate(selectedConsultation.date)} {formatTime(selectedConsultation.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">상담 유형</p>
                      <p className="font-medium">{selectedConsultation.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">상태</p>
                      <div className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${getStatusColor(selectedConsultation.status)}`}>
                        {selectedConsultation.status}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">특이사항</p>
                      <p className="p-3 bg-blue-50 rounded-md">
                        {selectedConsultation.notes || '특이사항 없음'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>router.push(`/dashboard/consultation-management/${selectedConsultation.id}`)}>
                      상담일지 확인
                    </Button>
                    <Button variant="outline" onClick={()=>alert("일정 수정")}>
                      일정 수정
                    </Button>
                    <Button variant="outline" className="text-red-500 border-red-500" onClick={()=>alert("일정 취소")}>
                      일정 취소
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            </div> 
          </Card>
        </div>
      </div>
        <div className='grid grid-cols-1'>
          <Sheet 
            title='은둔고립청년 상담일지'
            downloadDisabled={false}
            columns={[
              {key: 'id', title: '번호'},
              {key: 'clientName', title: '상담 대상자'},
              {key: 'consultantName', title: '상담자'},
              {key: 'status', title: '진행여부'},
              {key: 'dateString', title: '상담 일시'},
              {key: 'notes', title: '특이사항'},
            ]}
            data={consultations.sort((a, b) => b.date.getTime() - a.date.getTime())}
          />
        </div>
    </div>
  )
}