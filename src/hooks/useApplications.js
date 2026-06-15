import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '../api/applications.api'
import toast from 'react-hot-toast'

export function useMyApplications() {
  return useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationsApi.getMyApplications().then((r) => r.data.data),
  })
}

export function useApply() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, data }) => applicationsApi.apply(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myApplications'] })
      toast.success('Application submitted!')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to apply'),
  })
}

export function useWithdraw() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => applicationsApi.withdraw(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myApplications'] })
      toast.success('Application withdrawn')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to withdraw'),
  })
}

export function useJobApplicants(jobId) {
  return useQuery({
    queryKey: ['applicants', jobId],
    queryFn: () => applicationsApi.getJobApplicants(jobId).then((r) => r.data.data),
    enabled: !!jobId,
  })
}

export function useUpdateStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => applicationsApi.updateStatus(id, status),
    onSuccess: (_, { jobId }) => {
      qc.invalidateQueries({ queryKey: ['applicants', jobId] })
      toast.success('Status updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update status'),
  })
}
