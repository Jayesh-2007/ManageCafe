import Badge from '../ui/Badge';

export default function OrderStatusBadge({ status, type = 'order' }) {
  if (!status) return null;

  if (type === 'order') {
    switch (status.toLowerCase()) {
      case 'draft': return <Badge variant="gray">Draft</Badge>;
      case 'paid': return <Badge variant="green">Paid</Badge>;
      case 'cancelled': return <Badge variant="red">Cancelled</Badge>;
      default: return <Badge variant="gray">{status}</Badge>;
    }
  }

  if (type === 'kds') {
    switch (status.toLowerCase()) {
      case 'to_cook': return <Badge variant="yellow">To Cook</Badge>;
      case 'preparing': return <Badge variant="blue">Preparing</Badge>;
      case 'completed': return <Badge variant="green">Completed</Badge>;
      default: return <Badge variant="gray">{status}</Badge>;
    }
  }
  
  return <Badge>{status}</Badge>;
}
