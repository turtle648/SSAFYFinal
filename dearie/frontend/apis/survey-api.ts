import {
  PostSurveyAnswerResponse,
  SurveyAnswerDetailInfo,
  YouthSurveyQuestionDTO,
} from "@/types/response.survey";
import api from "./axiosClient";
import {
  PostAgreementRequestDTO,
  PostSurveyRequestDTO,
  PostSurveyWithOutSignUp,
} from "@/types/request.survey";

export const getSurveyQuestions = (): Promise<YouthSurveyQuestionDTO> => {
  return api.get("/survey/isolated-youth/questions").then((res) => {
    if (res.status === 200) {
      return res.data.result as YouthSurveyQuestionDTO;
    }
    throw new Error(
      "고립 은둔 청년 설문 조사 질문지 가져오는데 실패하였습니다."
    );
  });
};

export const postSurveyAnswer = (
  answer: PostSurveyRequestDTO
): Promise<PostSurveyAnswerResponse> => {
  return api.post("/survey/isolated-youth", answer).then((res) => {
    if (res.status === 200) {
      return res.data.result as PostSurveyAnswerResponse;
    }

    throw new Error(
      "고립 은둔 청년 설문 조사 질문 결과 전송에 문제가 발생하였습니다."
    );
  });
};

export const postSurveyAnswerByGuest = async (
  answer: PostSurveyWithOutSignUp
): Promise<boolean> => {
  try {
    const res = await api.post("/survey/isolated-youth/guest", answer);
    return res.status === 200;
  } catch (error) {
    console.error(
      "고립 은둔 청년 설문 조사 질문 결과 전송에 문제가 발생하였습니다.",
      error
    );
    return false;
  }
};

export const getSurveyAnswerDetailInfo = (
  surveyId: number
): Promise<SurveyAnswerDetailInfo> => {
  return api.get(`/survey/isolated-youth/${surveyId}/results`).then((res) => {
    if (res.status === 200) {
      return res.data.result as SurveyAnswerDetailInfo;
    }

    throw new Error(
      "고립 은둔 청년 설문 조사 질문 결과 조회에 문제가 발생하였습니다."
    );
  });
};

export const postAgreement = async (
  PostAgreementRequestDTO: PostAgreementRequestDTO
): Promise<boolean> => {
  try {
    const res = await api.post(
      "/survey/isolated-youth/agreement",
      PostAgreementRequestDTO
    );
    return res.status === 200;
  } catch (error) {
    console.error(
      "고립 은둔 청년 설문 조사 질문 전송 동의에 문제가 발생하였습니다.",
      error
    );
    return false;
  }
};

export const postSurveyResultToDashboard = async (
  surveyId: number
): Promise<boolean> => {
  try {
    const res = await api.post(`/survey/isolated-youth/${surveyId}/send`);
    return res.status === 200;
  } catch (error) {
    console.error(
      "고립 은둔 청년 설문 조사 질문 결과 전송에 문제가 발생하였습니다.",
      error
    );
    return false;
  }
};
