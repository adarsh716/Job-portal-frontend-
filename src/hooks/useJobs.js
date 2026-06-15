import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jobsApi } from '../api/jobs.api'
import toast from 'react-hot-toast'

export function useJobs(params) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params).then((r) => r.data.data),
  })
}

export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id).then((r) => r.data.data),
    enabled: !!id,
  })
}

export function useMyJobs() {
  return useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobsApi.getMyJobs().then((r) => r.data.data),
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => jobsApi.createJob(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job posted successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create job'),
  })
}

export function useUpdateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => jobsApi.updateJob(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job updated successfully')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update job'),
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => jobsApi.deleteJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'] })
      qc.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete job'),
  })
}
